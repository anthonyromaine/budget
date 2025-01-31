import { create } from 'zustand';

type Category = {
    name: string,
    type: "expense" | "income",
    color: "string",
    icon: "string"
}

interface BudgetState {
    budgetUrl: string | null,
    categories: Category[],
    setBudgetUrl: (budgetUrl: string) => void
}

export const useBudgetStore = create<BudgetState>((set) => ({
    budgetUrl: null,
    categories: [],
    setBudgetUrl: (budgetUrl: string) => set({ budgetUrl }),
}))