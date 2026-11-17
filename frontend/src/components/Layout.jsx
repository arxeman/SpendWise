import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Icon, { Logo } from "./Icon";
import TransactionModal from "./TransactionModal";
import ConfirmDialog from "./ConfirmDialog";
import { TransactionsProvider } from "../context/TransactionsContext";
import { useTransactions } from "../context/transactionsStore";
import { useToast } from "../context/toastContext";
import { getUser, inr } from "../utils/format";

function Shell() {
    const navigate = useNavigate();
    const toast = useToast();
    const { remove } = useTransactions();
    const user = getUser();
    const [modal, setModal] = useState(null);   // { tx } | null
    const [pendingDelete, setPendingDelete] = useState(null);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    const confirmDelete = async () => {
        try {
            await remove(pendingDelete._id);
            toast("Transaction deleted");
        } catch (e) {
            toast(e.response?.data?.message || "Couldn't delete. Try again.", "error");
        } finally {
            setPendingDelete(null);
        }
    };

    const initials = (user?.name || "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
    const links = [
        { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
        { to: "/transactions", icon: "list", label: "Transactions" }
    ];

    return (
        <div className="shell">
            <aside className="sidebar">
                <div className="brand"><Logo /><span>SpendWise</span></div>

                <button className="btn btn-primary btn-block" onClick={() => setModal({ tx: null })}>
                    <Icon name="plus" size={18} /> Add transaction
                </button>

                <nav className="side-nav" aria-label="Main">
                    {links.map((l) => (
                        <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
                            <Icon name={l.icon} size={19} /> {l.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="side-user">
                    <span className="avatar">{initials}</span>
                    <div className="who">
                        <strong>{user?.name || "Account"}</strong>
                        <small>{user?.email}</small>
                    </div>
                    <button className="icon-btn dark" onClick={logout} aria-label="Log out" title="Log out">
                        <Icon name="logout" size={18} />
                    </button>
                </div>
            </aside>

            <header className="topbar">
                <div className="brand"><Logo size={30} /><span>SpendWise</span></div>
                <button className="icon-btn" onClick={logout} aria-label="Log out"><Icon name="logout" size={19} /></button>
            </header>

            <main className="main">
                <Outlet context={{
                    openAdd: () => setModal({ tx: null }),
                    openEdit: (tx) => setModal({ tx }),
                    askDelete: (tx) => setPendingDelete(tx)
                }} />
            </main>

            <nav className="tabbar" aria-label="Main">
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                    <Icon name="dashboard" size={21} /><span>Home</span>
                </NavLink>
                <button className="tab-add" onClick={() => setModal({ tx: null })} aria-label="Add transaction">
                    <Icon name="plus" size={24} stroke={2.4} />
                </button>
                <NavLink to="/transactions" className={({ isActive }) => (isActive ? "active" : "")}>
                    <Icon name="list" size={21} /><span>History</span>
                </NavLink>
            </nav>

            {modal && <TransactionModal tx={modal.tx} onClose={() => setModal(null)} />}
            {pendingDelete && (
                <ConfirmDialog
                    title="Delete this transaction?"
                    body={`${pendingDelete.title} (${inr(pendingDelete.amount)}) will be removed from your records. This can't be undone.`}
                    confirmLabel="Delete"
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}
        </div>
    );
}

export default function AppShell() {
    return (
        <TransactionsProvider>
            <Shell />
        </TransactionsProvider>
    );
}
