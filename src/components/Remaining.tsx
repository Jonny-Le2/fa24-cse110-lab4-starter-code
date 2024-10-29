import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const Remaining = () => {
  const { expenses } = useContext(AppContext);
  let budget = 1000;

  // Calculate the total expenses
  const totalExpenses = expenses.reduce((total, item) => total + item.cost, 0);

  // Determine alert type based on remaining balance
  const alertType = totalExpenses > budget ? "alert-danger" : "alert-success";

  // Calculate remaining balance
  const remainingBalance = budget - totalExpenses;

  // Trigger alert when remaining balance is less than 0
  useEffect(() => {
    if (remainingBalance < 0) {
      alert("Warning: You have exceeded your budget!");
    }
  }, [remainingBalance]); // Dependency array to watch remainingBalance changes

  return (
    <div className={`alert ${alertType}`}>
      <span>Remaining: ${remainingBalance.toFixed(2)}</span>
    </div>
  );
};

export default Remaining;