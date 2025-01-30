import { create } from 'zustand';

type Category = {
    name: string,
    type: "expense" | "income",
    color: "string",
    icon: "string"
}

interface BudgetState {
    categories: Category[]
}

const useBudgetStore = create<BudgetState>((set) => ({
    categories: []
}))