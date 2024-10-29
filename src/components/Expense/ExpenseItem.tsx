import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

interface ExpenseItemProps {
  id: string;
  name: string;
  cost: number;
}

const ExpenseItem = ({ id, name, cost }: ExpenseItemProps) => {
  const { expenses, setExpenses } = useContext(AppContext);

  const handleDeleteExpense = (expenseId: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
    setExpenses(updatedExpenses);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span>{name}</span>
      <span>${cost.toFixed(2)}</span> {/* Display cost with 2 decimal places */}
      <button
        onClick={() => handleDeleteExpense(id)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    </li>
  );
};

export default ExpenseItem;