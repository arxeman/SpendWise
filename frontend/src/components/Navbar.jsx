import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-logo">
                SpendWise
            </Link>

            <div className="navbar-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/transactions">Transactions</Link>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
