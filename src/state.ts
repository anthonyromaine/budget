import { create } from 'zustand';
import axios from 'axios';
import Papa from 'papaparse';
import { type } from 'arktype';

type Category = {
    name: string,
    type: "expense" | "income",
    color: "string",
    icon: "string"
}

type BudgetCSV = {
    Date: string,
    Budget: string,
    Giving: string,	
    Savings: string,	
    Wants: string,	
    Needs: string
}

type BudgetUrls = {budget: string, transactions: string, categories: string};

const ValidCategories = type({
    name: "string",
    amount: "number"
});

const ValidBudget = type({
    date: "Date",
    budget: "number",
    categories: ValidCategories.array()
});

type Budget = typeof ValidBudget.infer;

interface BudgetState {
    budgetUrl: boolean,
    categories: Category[],
    budget: Budget[],
    setBudgetUrl: (urls: BudgetUrls) => Promise<void>
}

function convertBudgetCSV(monthlyBudget: BudgetCSV){
    let entries = Object.entries(monthlyBudget);
    let date, budget, categories = [];
    
    for (let [key, value] of entries){
        if (key == "Date"){
            date = monthlyBudget.Date.trim() ? new Date(monthlyBudget.Date.trim()) : undefined;
        } else if(key == "Budget"){
            budget = monthlyBudget.Budget.trim() ? Number(monthlyBudget.Budget.trim()): undefined;
        } else {
            // everything else should be a category
            categories.push({ name: key.trim(), amount: value.trim() ? Number(value.trim()) : undefined })
        }
    }

    let newBudget = ValidBudget({ budget, date, categories });

    if (!(newBudget instanceof type.errors)){
        return newBudget;
    }
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
    budgetUrl: false,
    categories: [],
    budget: [],
    setBudgetUrl: async (urls: BudgetUrls) => {
        // fetch data
        let budgetData = (await axios.get(urls.budget)).data;
        let transactionData = (await axios.get(urls.transactions)).data;
        let categoriesData = (await axios.get(urls.categories)).data;

        // parse csv
        let budgetCSVData: BudgetCSV[] = Papa.parse(budgetData, {
            header: true
        }).data;

        transactionData = Papa.parse(transactionData, {
            header: true
        });

        categoriesData = Papa.parse(categoriesData, {
            header: true
        });

        // convert data
        //@ts-ignore (undefined items are filtered out, everything else has already been validated)
        let budget: Budget[] = budgetCSVData.map(convertBudgetCSV).filter(monthlyBudget => monthlyBudget);

        localStorage.setItem("urls", JSON.stringify(urls));
        console.log(budgetData, transactionData, categoriesData);
        set({ budgetUrl: true, budget });
    },
}))