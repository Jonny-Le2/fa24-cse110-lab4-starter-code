import { createContext, useState } from "react";
import { Expense } from "../types/types";

// Define the context type to include budget and setBudget
interface AppContextType {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  budget: number;
  setBudget: React.Dispatch<React.SetStateAction<number>>;
}

// Initialize the default context state
const initialState: AppContextType = {
  expenses: [],
  setExpenses: () => {},
  budget: 1000, // Default budget value, can be adjusted as needed
  setBudget: () => {},
};

// Create the context with the initial state
export const AppContext = createContext<AppContextType>(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialState.expenses);
  const [budget, setBudget] = useState<number>(initialState.budget);

  return (
    <AppContext.Provider
      value={{
        expenses,
        setExpenses,
        budget,
        setBudget,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};