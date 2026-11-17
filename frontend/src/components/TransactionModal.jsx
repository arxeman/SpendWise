import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useTransactions } from "../context/transactionsStore";
import { useToast } from "../context/toastContext";
import { categoriesFor, metaFor } from "../utils/categories";
import { dateKey, localTodayKey } from "../utils/format";

export default function TransactionModal({ tx, onClose }) {
    const { add, update } = useTransactions();
    const toast = useToast();
    const editing = !!tx;
    const amountRef = useRef(null);

    const [f, setF] = useState(() =>
        tx
            ? {
                  type: tx.type,
                  title: tx.title,
                  amount: String(tx.amount),
                  category: tx.category,
                  date: dateKey(tx.date),
                  description: tx.description || ""
              }
            : { type: "expense", title: "", amount: "", category: "Food", date: localTodayKey(), description: "" }
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        amountRef.current?.focus();
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

    const setType = (type) =>
        setF((s) => ({
            ...s,
            type,
            category: categoriesFor(type).includes(s.category) ? s.category : categoriesFor(type)[0]
        }));

    const onAmount = (v) => {
        if (/^\d*\.?\d{0,2}$/.test(v)) set("amount", v);
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        const amount = Number(f.amount);
        if (!f.title.trim()) return setError("Add a title so you can find this later.");
        if (!(amount > 0)) return setError("Enter an amount greater than zero.");

        const payload = {
            title: f.title.trim(),
            amount,
            type: f.type,
            category: f.category,
            date: f.date,
            description: f.description.trim()
        };

        setSaving(true);
        try {
            if (editing) await update(tx._id, payload);
            else await add(payload);
            toast(editing ? "Changes saved" : "Transaction added");
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Couldn't save. Check your connection and try again.");
            setSaving(false);
        }
    };

    return (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <form className={`modal ${f.type}`} onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="tx-title" noValidate>
                <div className="modal-head">
                    <h2 id="tx-title">{editing ? "Edit transaction" : "New transaction"}</h2>
                    <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={19} /></button>
                </div>

                <div className="seg seg-wide" role="group" aria-label="Type">
                    <button type="button" className={f.type === "expense" ? "on out" : ""} onClick={() => setType("expense")}>
                        <Icon name="down" size={16} /> Expense
                    </button>
                    <button type="button" className={f.type === "income" ? "on in" : ""} onClick={() => setType("income")}>
                        <Icon name="up" size={16} /> Income
                    </button>
                </div>

                <label className="amount-field">
                    <span className="sr">Amount in rupees</span>
                    <b>₹</b>
                    <input
                        ref={amountRef}
                        inputMode="decimal"
                        placeholder="0"
                        value={f.amount}
                        onChange={(e) => onAmount(e.target.value)}
                        autoComplete="off"
                    />
                </label>

                <div className="field">
                    <label htmlFor="tx-name">Title</label>
                    <input
                        id="tx-name"
                        className="input"
                        placeholder={f.type === "income" ? "e.g. Internship stipend" : "e.g. Canteen lunch"}
                        value={f.title}
                        onChange={(e) => set("title", e.target.value)}
                        maxLength={80}
                    />
                </div>

                <div className="field">
                    <label>Category</label>
                    <div className="chips">
                        {categoriesFor(f.type).map((c) => {
                            const m = metaFor(c);
                            const on = f.category === c;
                            return (
                                <button
                                    type="button"
                                    key={c}
                                    className={`chip ${on ? "on" : ""}`}
                                    style={on ? { background: m.color, borderColor: m.color } : undefined}
                                    onClick={() => set("category", c)}
                                    aria-pressed={on}
                                >
                                    <Icon name={m.icon} size={15} /> {c}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="tx-date">Date</label>
                    <input id="tx-date" type="date" className="input" value={f.date} max={localTodayKey()} onChange={(e) => set("date", e.target.value)} required />
                </div>

                <div className="field">
                    <label htmlFor="tx-note">Note <small>(optional)</small></label>
                    <textarea id="tx-note" className="input" rows={2} value={f.description} onChange={(e) => set("description", e.target.value)} maxLength={200} />
                </div>

                {error && <p className="form-error" role="alert">{error}</p>}

                <button className="btn btn-primary btn-block btn-lg" disabled={saving}>
                    {saving ? "Saving…" : editing ? "Save changes" : "Add transaction"}
                </button>
            </form>
        </div>
    );
}
