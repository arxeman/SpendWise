import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import API from "../services/api";
import "./Transactions.css";

function Transactions() {
    const [transactions, setTransactions] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        type: "expense",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        description: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const fetchTransactions = async () => {
        try {
            const response = await API.get("/transactions");
            setTransactions(response.data.data);
        } catch (error) {
            setMessage("Unable to load transactions");
        }
    };
    const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
        await API.delete(`/transactions/${id}`);

        setMessage("Transaction deleted successfully!");

        await fetchTransactions();

    } catch (error) {
        setMessage(
            error.response?.data?.message ||
            "Unable to delete transaction"
        );
    }
};
    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
    //         if (editingId) {
    // await API.put(`/transactions/${editingId}`, {
    //     ...formData,
    //     amount: Number(formData.amount)
    // });
    if (editingId) {
    
    const response = await API.put(`/transactions/${editingId}`, {
        ...formData,
        amount: Number(formData.amount)
    });

    
    setMessage("Transaction updated successfully!");
    setEditingId(null);

} else {
    await API.post("/transactions", {
        ...formData,
        amount: Number(formData.amount)
    });

    setMessage("Transaction added successfully!");
    
}/*await API.post("/transactions", {
                ...formData,
                amount: Number(formData.amount)
            });

            setMessage("Transaction added successfully!");
          */
            setFormData({
                title: "",
                amount: "",
                type: "expense",
                category: "Food",
                date: new Date().toISOString().split("T")[0],
                description: ""
            });

            await fetchTransactions();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to add transaction"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
      <>
        <Navbar />
        <div className="transactions-container">

            <h1>Transactions</h1>
            <p className="page-subtitle">
                Track your income and expenses.
            </p>

            <div className="transaction-form-card">
                <h2>Add New Transaction</h2>

                <form onSubmit={handleSubmit}>

                    <label>Transaction Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. College Lunch"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Enter amount"
                        min="0.01"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        onWheel={(e)=>e.currentTarget.blur()}
                        required
                    />

                    <label>Transaction Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>

                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Education">Education</option>
                        <option value="Salary">Salary</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        placeholder="Optional description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <button type="submit" disabled={loading}>
                      {loading
                      ? "Saving..."
                      : editingId
                      ? "Update Transaction"
                      : "Add Transaction"}
                    </button>

                </form>

                {message && <p className="transaction-message">{message}</p>}
            </div>

            <div className="transaction-list-card">
                <h2>All Transactions</h2>

                {transactions.length === 0 ? (
                    <p>No transactions added yet.</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td>{transaction.title}</td>
                                        <td>{transaction.category}</td>
                                        <td>{transaction.type}</td>
                                        <td>
                                            ₹{transaction.amount.toLocaleString("en-IN")}
                                        </td>
                                        <td>
                                            {new Date(transaction.date).toLocaleDateString("en-IN")}
                                        </td>
                                        <td>
    <button
        onClick={() => {
            setEditingId(transaction._id);

            setFormData({
                title: transaction.title,
                amount: String(transaction.amount),
                type: transaction.type,
                category: transaction.category,
                date: new Date(transaction.date)
                    .toISOString()
                    .split("T")[0],
                description: transaction.description || ""
            });

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }}
    >
        Edit
    </button>

    <button
        onClick={() => handleDelete(transaction._id)}
        style={{ backgroundColor: "#dc2626" }}
    >
        Delete
    </button>
</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
      </>
    );
  
}

export default Transactions;
