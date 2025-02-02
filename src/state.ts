import { create } from 'zustand';
import axios from 'axios';
import Papa from 'papaparse';
import { type } from 'arktype';

type BudgetCSV = {
    Date: string,
    Budget: string,
    Giving: string,	
    Savings: string,	
    Wants: string,	
    Needs: string
}

type TransactionCSV = {
    Date: string,	
    Category: string,	
    Amount: string,	
    Note: string,	
    Tags: string
}

type CategoryCSV = {
    Name: string,	
    Type: string,	
    Color: string,	
    Icon: string
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

const ValidTransaction = type({
    date: 'Date',
    category: 'string',
    amount: 'number',
    note: 'string',
    tags: 'string[]'
});

type Transaction = typeof ValidTransaction.infer;

const ValidCategory = type({
    name: 'string',
    color: 'string',
    type: "'income' | 'expense'",
    icon: 'string'
});

export type Category = typeof ValidCategory.infer;

interface BudgetState {
    budgetUrl: boolean,
    categories: Category[],
    budget: Budget[],
    transactions: Transaction[],
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

function convertTransactionsCSV(transaction: TransactionCSV){
    const newTransaction = ValidTransaction({
        date: transaction.Date.trim() ? new Date(transaction.Date.trim()) : undefined,
        category: transaction.Category.trim() ? transaction.Category.trim() : undefined,
        amount: transaction.Amount.trim() ? Number(transaction.Amount.trim()) : undefined,
        note: transaction.Note.trim(),
        tags: transaction.Tags.trim() ? transaction.Tags.trim().split(',').map(tag => tag.trim()).filter(tag => tag) : []
    });

    return newTransaction instanceof type.errors ? undefined : newTransaction;
}

function convertCategoryCSV(category: CategoryCSV){
    const newCategory = ValidCategory({
        name: category.Name.trim() ? category.Name.trim() : undefined,
        type: category.Type.trim() ? category.Type.trim().toLowerCase() : undefined,
        color: category.Color.trim() ? category.Color.trim() : undefined,
        icon: category.Icon.trim() ? category.Icon.trim() : undefined
    });

    return newCategory instanceof type.errors ? undefined : newCategory;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
    budgetUrl: false,
    categories: [],
    budget: [],
    transactions: [],
    setBudgetUrl: async (urls: BudgetUrls) => {
        // fetch data
        let budgetData = (await axios.get(urls.budget)).data;
        let transactionData = (await axios.get(urls.transactions)).data;
        let categoriesData = (await axios.get(urls.categories)).data;

        // parse csv
        let budgetCSVData: BudgetCSV[] = Papa.parse(budgetData, {
            header: true
        }).data;

        let transactionCSVData: TransactionCSV[] = Papa.parse(transactionData, {
            header: true
        }).data;

        let categoriesCSVData: CategoryCSV[] = Papa.parse(categoriesData, {
            header: true
        }).data;

        // convert data
        //@ts-ignore (undefined items are filtered out, everything else has already been validated)
        let budget: Budget[] = budgetCSVData.map(convertBudgetCSV).filter(monthlyBudget => monthlyBudget);
        //@ts-ignore (undefined items are filtered out, everything else has already been validated)
        let transactions: Transaction[] = transactionCSVData.map(convertTransactionsCSV).filter(transaction => transaction);
        //@ts-ignore (undefined items are filtered out, everything else has already been validated)
        let categories: Category[] = categoriesCSVData.map(convertCategoryCSV).filter(category => category);

        localStorage.setItem("urls", JSON.stringify(urls));
        set({ budgetUrl: true, budget, transactions, categories });
    },
}))