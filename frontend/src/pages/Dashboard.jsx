import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";
import { Link } from "react-router-dom";
function Dashboard() {
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0
    });

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [summaryResponse, transactionResponse] =
                    await Promise.all([
                        API.get("/transactions/summary"),
                        API.get("/transactions")
                    ]);

                setSummary(summaryResponse.data.data);
                setTransactions(transactionResponse.data.data);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR"
        }).format(amount);
    };

    if (loading) {
        return <h2 className="loading">Loading dashboard...</h2>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
      <>
        <Navbar />
        <div className="dashboard-container">

            <header className="dashboard-header">
                <div>
                    <h1>SpendWise</h1>
                    <p>Your personal finance dashboard</p>
                </div>

                <div className="user-info">
    <h3>
        Welcome back, {
            JSON.parse(localStorage.getItem("user"))?.name || "User"
        }!
    </h3>
    <p>Here's your financial overview.</p>
</div>
            </header>

            <h2 className="section-title">Financial Overview</h2>

            <div className="summary-grid">

                <div className="summary-card income-card">
    <span className="card-icon">↗</span>
    <h3>Total Income</h3>
    <h2>{formatCurrency(summary.totalIncome)}</h2>
    <p>Money received</p>
</div>

                <div className="summary-card expense-card">
    <span className="card-icon">↘</span>
    <h3>Total Expenses</h3>
    <h2>{formatCurrency(summary.totalExpenses)}</h2>
    <p>Money spent</p>
</div>

                <div className="summary-card balance-card">
    <span className="card-icon">₹</span>
    <h3>Current Balance</h3>
    <h2>{formatCurrency(summary.balance)}</h2>
    <p>Income minus expenses</p>
</div>

            </div>

            <div className="transactions-section">
                <h2>Recent Transactions</h2>
                <Link to="/transactions" className="view-all-btn">
    View All Transactions →
</Link>
                {transactions.length === 0 ? (
    <div className="empty-state">
        <h3>No transactions yet!</h3>
        <p>Start tracking your income and expenses today.</p>

        <Link to="/transactions" className="view-all-btn">
            Add Your First Transaction
        </Link>
    </div>
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
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.slice(0, 5).map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td>{transaction.title}</td>
                                        <td>{transaction.category}</td>
                                        <td>{transaction.type}</td>
                                        <td>{formatCurrency(transaction.amount)}</td>
                                        <td>
                                            {new Date(
                                                transaction.date
                                            ).toLocaleDateString("en-IN")}
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

export default Dashboard;
