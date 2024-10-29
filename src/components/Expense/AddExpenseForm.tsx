import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext"; // Import context
import { Expense } from "../../types/types"; // Import the Expense type if needed

const AddExpenseForm = () => {
  // Consume AppContext to access expenses and setExpenses
  const { expenses, setExpenses } = useContext(AppContext);

  // State variables for form inputs
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Parse cost as a number and check for valid values
    const parsedCost = parseFloat(cost);
    if (isNaN(parsedCost) || parsedCost <= 0) {
      alert("Please enter a valid cost.");
      return;
    }

    // Create new expense with id as a string and add it to the context's expenses array
    const newExpense: Expense = { id: Date.now().toString(), name, cost: parsedCost };
    setExpenses([...expenses, newExpense]);

    // Reset form inputs
    setName("");
    setCost("");
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure only numbers or a decimal point are typed
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setCost(value);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <div className="col-sm">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="form-control"
            id="name"
            value={name} // Controlled input for name
            onChange={(e) => setName(e.target.value)} // Update name state
          />
        </div>
        <div className="col-sm">
          <label htmlFor="cost">Cost</label>
          <input
            required
            type="text" // Set to text to allow free typing without spinner
            className="form-control"
            id="cost"
            value={cost} // Controlled input for cost
            onChange={handleCostChange} // Update cost state with validation
            placeholder="Enter amount" // Optional placeholder
          />
        </div>
        <div className="col-sm">
          <button type="submit" className="btn btn-primary mt-3">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddExpenseForm;