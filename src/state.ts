import { create } from 'zustand';
import axios from 'axios';
import Papa from 'papaparse';

type Category = {
    name: string,
    type: "expense" | "income",
    color: "string",
    icon: "string"
}

type BudgetUrls = {budget: string, transactions: string, categories: string};

interface BudgetState {
    budgetUrl: boolean,
    categories: Category[],
    setBudgetUrl: (urls: BudgetUrls) => Promise<void>
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
    budgetUrl: false,
    categories: [],
    setBudgetUrl: async (urls: BudgetUrls) => {
        // fetch data
        let budgetData = (await axios.get(urls.budget)).data;
        let transactionData = (await axios.get(urls.transactions)).data;
        let categoriesData = (await axios.get(urls.categories)).data;

        // parse csv
        budgetData = Papa.parse(budgetData, {
            header: true
        });

        transactionData = Papa.parse(transactionData, {
            header: true
        });

        categoriesData = Papa.parse(categoriesData, {
            header: true
        });

        localStorage.setItem("urls", JSON.stringify(urls));
        console.log(budgetData, transactionData, categoriesData);
        set({ budgetUrl: true });
    },
}))