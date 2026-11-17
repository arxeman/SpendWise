import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Icon from "../components/Icon";
import TxRow from "../components/TxRow";
import { useTransactions } from "../context/transactionsStore";
import { useToast } from "../context/toastContext";
import { dateKey, dayLabel, inr, monthKey, monthLabel } from "../utils/format";

function Transactions() {
    const { items, loading, error, refresh } = useTransactions();
    const { openAdd, openEdit, askDelete } = useOutletContext();
    const toast = useToast();

    const [q, setQ] = useState("");
    const [type, setType] = useState("all");
    const [category, setCategory] = useState("all");
    const [month, setMonth] = useState("all");

    const months = useMemo(() => [...new Set(items.map((t) => monthKey(t.date)))].sort().reverse(), [items]);
    const categories = useMemo(() => [...new Set(items.map((t) => t.category))].sort(), [items]);

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        return items.filter((t) =>
            (type === "all" || t.type === type) &&
            (category === "all" || t.category === category) &&
            (month === "all" || monthKey(t.date) === month) &&
            (!needle || `${t.title} ${t.category} ${t.description || ""}`.toLowerCase().includes(needle))
        );
    }, [items, q, type, category, month]);

    const totals = useMemo(() => {
        const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const expense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        return { income, expense, net: income - expense };
    }, [filtered]);

    const groups = useMemo(() => {
        const map = new Map();
        filtered.forEach((t) => {
            const k = dateKey(t.date);
            if (!map.has(k)) map.set(k, []);
            map.get(k).push(t);
        });
        return [...map.entries()];
    }, [filtered]);

    const filtersOn = q || type !== "all" || category !== "all" || month !== "all";
    const clear = () => { setQ(""); setType("all"); setCategory("all"); setMonth("all"); };

    const exportCsv = () => {
        const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const rows = [["Date", "Title", "Type", "Category", "Amount", "Note"],
            ...filtered.map((t) => [dateKey(t.date), t.title, t.type, t.category, t.amount, t.description])];
        const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `spendwise-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
        toast(`Exported ${filtered.length} transactions`);
    };

    if (error) {
        return (
            <div className="state-card">
                <h2>Couldn't load transactions</h2>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={refresh}>Try again</button>
            </div>
        );
    }

    return (
        <>
            <header className="page-head">
                <div>
                    <h1>Transactions</h1>
                    <p>{loading ? "Loading…" : `${items.length} total`}</p>
                </div>
                <div className="head-actions">
                    <button className="btn btn-ghost" onClick={exportCsv} disabled={!filtered.length}>
                        <Icon name="download" size={17} /> Export CSV
                    </button>
                    <button className="btn btn-primary desk-only" onClick={openAdd}>
                        <Icon name="plus" size={18} /> Add transaction
                    </button>
                </div>
            </header>

            <section className="card toolbar">
                <label className="search">
                    <Icon name="search" size={18} />
                    <span className="sr">Search transactions</span>
                    <input placeholder="Search by title, category or note" value={q} onChange={(e) => setQ(e.target.value)} />
                </label>
                <div className="seg" role="group" aria-label="Filter by type">
                    {["all", "expense", "income"].map((t) => (
                        <button key={t} className={type === t ? "on" : ""} onClick={() => setType(t)}>
                            {t === "all" ? "All" : t === "expense" ? "Spent" : "Earned"}
                        </button>
                    ))}
                </div>
                <select className="input select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
                    <option value="all">All categories</option>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                <select className="input select" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month">
                    <option value="all">All time</option>
                    {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
                </select>
            </section>

            {!loading && filtered.length > 0 && (
                <div className="totals">
                    <div><small>Earned</small><strong className="pos">{inr(totals.income)}</strong></div>
                    <div><small>Spent</small><strong>{inr(totals.expense)}</strong></div>
                    <div><small>Net</small><strong className={totals.net >= 0 ? "pos" : "neg"}>{totals.net >= 0 ? "+" : "−"}{inr(Math.abs(totals.net))}</strong></div>
                </div>
            )}

            {loading ? (
                <div className="card"><div className="sk" style={{ height: 64, marginBottom: 12 }} /><div className="sk" style={{ height: 64, marginBottom: 12 }} /><div className="sk" style={{ height: 64 }} /></div>
            ) : items.length === 0 ? (
                <div className="card empty">
                    <h3>No transactions yet</h3>
                    <p>Log your first income or expense to start tracking.</p>
                    <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={18} /> Add transaction</button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="card empty">
                    <h3>No matches</h3>
                    <p>Nothing fits those filters.</p>
                    {filtersOn && <button className="btn btn-ghost" onClick={clear}>Clear filters</button>}
                </div>
            ) : (
                groups.map(([k, list]) => (
                    <section className="day" key={k}>
                        <h2 className="day-label">{dayLabel(k)}</h2>
                        <ul className="card tx-list">
                            {list.map((t) => <TxRow key={t._id} tx={t} onEdit={openEdit} onDelete={askDelete} />)}
                        </ul>
                    </section>
                ))
            )}
        </>
    );
}

export default Transactions;
