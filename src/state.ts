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

type Budget = {
    Date: Date | undefined,
    Budget: number | undefined,
    Categories: { name: string | undefined, amount: number | undefined }[]
}

type BudgetUrls = {budget: string, transactions: string, categories: string};

interface BudgetState {
    budgetUrl: boolean,
    categories: Category[],
    setBudgetUrl: (urls: BudgetUrls) => Promise<void>
}

const ValidCategories = type({
    name: "string",
    amount: "number"
});

const ValidBudget = type({
    Date: "Date",
    Budget: "number",
    Categories: ValidCategories.array()
});

export const useBudgetStore = create<BudgetState>((set, get) => ({
    budgetUrl: false,
    categories: [],
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
        let budget = budgetCSVData.map((monthlyBudget) => {
            let entries = Object.entries(monthlyBudget);
            let newMonthlyBudget: Budget = { Categories: [], Date: undefined, Budget: undefined };
            
            for (let [key, value] of entries){
                if (key == "Date"){
                    newMonthlyBudget.Date = monthlyBudget.Date.trim() ? new Date(monthlyBudget.Date.trim()) : undefined;
                } else if(key == "Budget"){
                    newMonthlyBudget.Budget = monthlyBudget.Budget.trim() ? Number(monthlyBudget.Budget.trim()): undefined;
                } else {
                    // everything else should be a category
                    newMonthlyBudget.Categories?.push({ name: key.trim(), amount: value.trim() ? Number(value.trim()) : undefined })
                }
            }

            return newMonthlyBudget;
        });

        budget = budget.filter(monthlyBudget => !(ValidBudget(monthlyBudget) instanceof type.errors));

        localStorage.setItem("urls", JSON.stringify(urls));
        console.log(budgetData, transactionData, categoriesData);
        set({ budgetUrl: true });
    },
}))