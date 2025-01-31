import { create } from 'zustand';
import axios from 'axios';
import * as xlsx from 'xlsx';

type Category = {
    name: string,
    type: "expense" | "income",
    color: "string",
    icon: "string"
}

interface BudgetState {
    budgetUrl: string | null,
    categories: Category[],
    setBudgetUrl: (budgetUrl: string) => Promise<void>
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
    budgetUrl: null,
    categories: [],
    setBudgetUrl: async (budgetUrl: string) => {
        let budgetData = (await axios.get(budgetUrl, {
            responseType: "arraybuffer"
        })).data;
        let workbook = xlsx.read(budgetData, {
            type: 'array'
        })

        for (let sheetName of workbook.SheetNames){
            console.log(workbook.Sheets[sheetName])
            console.log(xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]))
        }
    },
}))