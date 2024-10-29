import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { AppProvider } from './context/AppContext';

const renderWithContext = (component: React.ReactNode) => {
  return render(<AppProvider>{component}</AppProvider>);
};

describe('Budget Tracking Application - Expense and Balance Tests', () => {

  /**
   * Test 1: Single Expense Exceeding Budget
   * Verifies that adding a single expense greater than the initial budget ($1000) results in
   * a negative remaining balance. Expected remaining balance after adding a $1200 expense should be -200.
   */
  test('should display negative remaining balance when adding a single expense exceeding the budget', () => {
    renderWithContext(<App />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Luxury Item' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '1200' } });
    fireEvent.click(screen.getByText(/save/i));

    expect(screen.getByText(/luxury item/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1200\.00/i)).toBeInTheDocument();

    const remainingBalanceText = screen.getByText(/remaining:/i);
    const remainingBalance = remainingBalanceText.textContent
      ? parseFloat(remainingBalanceText.textContent.replace('Remaining: $', ''))
      : 0;
    expect(remainingBalance).toBe(-200);
  });

  /**
   * Test 2: Multiple Expenses Exceeding Budget
   * Confirms that adding multiple expenses cumulatively exceeding the budget
   * results in a negative remaining balance. Adding $600 and $500 should lead to a remaining balance of -100.
   */
  test('should display negative remaining balance when multiple expenses cumulatively exceed the budget', () => {
    renderWithContext(<App />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Hotel' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '600' } });
    fireEvent.click(screen.getByText(/save/i));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Flight' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '500' } });
    fireEvent.click(screen.getByText(/save/i));

    const remainingBalanceText = screen.getByText(/remaining:/i);
    const remainingBalance = remainingBalanceText.textContent
      ? parseFloat(remainingBalanceText.textContent.replace('Remaining: $', ''))
      : 0;
    expect(remainingBalance).toBe(-100);
  });

  /**
   * Test 3: Single Expense Within Budget
   * Verifies that adding a single expense within the budget correctly decreases the remaining balance.
   * Adding a $50 expense should reduce the remaining balance from $1000 to $950.
   */
  test('should update remaining balance when adding a single expense within the budget', () => {
    renderWithContext(<App />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Groceries' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '50' } });
    fireEvent.click(screen.getByText(/save/i));

    expect(screen.getByText(/groceries/i)).toBeInTheDocument();
    expect(screen.getByText(/\$50\.00/i)).toBeInTheDocument();

    const remainingBalanceText = screen.getByText(/remaining:/i);
    const remainingBalance = remainingBalanceText.textContent
      ? parseFloat(remainingBalanceText.textContent.replace('Remaining: $', ''))
      : 0;
    expect(remainingBalance).toBe(950);
  });

  /**
   * Test 4: Multiple Expenses Within Budget
   * Confirms that adding multiple expenses within the budget results in a cumulative decrease in remaining balance.
   * Adding $20 and $10 expenses should lead to a remaining balance of $970.
   */
  test('should update remaining balance correctly when adding multiple expenses within the budget', () => {
    renderWithContext(<App />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Lunch' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '20' } });
    fireEvent.click(screen.getByText(/save/i));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Coffee' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '10' } });
    fireEvent.click(screen.getByText(/save/i));

    const remainingBalanceText = screen.getByText(/remaining:/i);
    const remainingBalance = remainingBalanceText.textContent
      ? parseFloat(remainingBalanceText.textContent.replace('Remaining: $', ''))
      : 0;
    expect(remainingBalance).toBe(970);
  });

  /**
   * Test 5: Single Expense Removal
   * Ensures that deleting an expense removes it from the display and increases the remaining balance accordingly.
   * Adding and then removing a $50 expense should return the remaining balance to the initial $1000.
   */
  test('should remove an expense from the list and update remaining balance accordingly', () => {
    renderWithContext(<App />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Groceries' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '50' } });
    fireEvent.click(screen.getByText(/save/i));

    expect(screen.getByText(/groceries/i)).toBeInTheDocument();
    expect(screen.getByText(/\$50\.00/i)).toBeInTheDocument();

    const remainingBalanceTextBeforeDelete = screen.getByText(/remaining:/i);
    const remainingBalanceBeforeDelete = remainingBalanceTextBeforeDelete.textContent
      ? parseFloat(remainingBalanceTextBeforeDelete.textContent.replace('Remaining: $', ''))
      : 0;
    expect(remainingBalanceBeforeDelete).toBe(950);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(screen.queryByText(/groceries/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$50\.00/i)).not.toBeInTheDocument();

    const remainingBalanceTextAfterDelete = screen.getByText(/remaining:/i);
    const remainingBalanceAfterDelete = remainingBalanceTextAfterDelete.textContent
      ? parseFloat(remainingBalanceTextAfterDelete.textContent.replace('Remaining: $', ''))
      : 0;
    expect(remainingBalanceAfterDelete).toBe(1000);
  });

  /**
   * Test 6: Multiple Expense Removal
   * Confirms that deleting multiple expenses updates the remaining balance incrementally.
   * Adding $30 and $20 expenses, then removing them sequentially, should incrementally return the remaining balance to $1000.
   */
  test('should correctly update remaining balance after removing multiple expenses', () => {
    renderWithContext(<App />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Dinner' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '30' } });
    fireEvent.click(screen.getByText(/save/i));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Taxi' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '20' } });
    fireEvent.click(screen.getByText(/save/i));

    const remainingBalanceTextBeforeDelete = screen.getByText(/remaining:/i);
    const remainingBalanceBeforeDelete = remainingBalanceTextBeforeDelete.textContent
      ? parseFloat(remainingBalanceTextBeforeDelete.textContent.replace('Remaining: $', ''))
      : 0;
    expect(remainingBalanceBeforeDelete).toBe(950);

    const dinnerDeleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(dinnerDeleteButton);

    expect(screen.queryByText(/dinner/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$30\.00/i)).not.toBeInTheDocument();

    const remainingBalanceTextAfterFirstDelete = screen.getByText(/remaining:/i);
    const remainingBalanceAfterFirstDelete = remainingBalanceTextAfterFirstDelete.textContent
      ? parseFloat(remainingBalanceTextAfterFirstDelete.textContent.replace('Remaining: $', ''))
      : 0;
    expect(remainingBalanceAfterFirstDelete).toBe(980);

    const taxiDeleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(taxiDeleteButton);

    expect(screen.queryByText(/taxi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$20\.00/i)).not.toBeInTheDocument();

    const remainingBalanceTextAfterAllDeletes = screen.getByText(/remaining:/i);
    const remainingBalanceAfterAllDeletes = remainingBalanceTextAfterAllDeletes.textContent
      ? parseFloat(remainingBalanceTextAfterAllDeletes.textContent.replace('Remaining: $', ''))
      : 0;
    expect(remainingBalanceAfterAllDeletes).toBe(1000);
  });
});