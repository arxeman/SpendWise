import Icon from "./Icon";
import { metaFor } from "../utils/categories";
import { inr } from "../utils/format";

export default function TxRow({ tx, onEdit, onDelete, showDate }) {
    const m = metaFor(tx.category);
    const income = tx.type === "income";
    return (
        <li className="tx">
            <span className="bubble" style={{ background: m.color + "1F", color: m.color }}>
                <Icon name={m.icon} size={19} />
            </span>
            <div className="tx-main">
                <strong>{tx.title}</strong>
                <small>
                    {tx.category}
                    {showDate && ` on ${new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" })}`}
                    {tx.description ? ` – ${tx.description}` : ""}
                </small>
            </div>
            <span className={`amt ${income ? "in" : ""}`}>{income ? "+" : "−"}{inr(tx.amount)}</span>
            {onEdit && (
                <div className="tx-actions">
                    <button className="icon-btn" onClick={() => onEdit(tx)} aria-label={`Edit ${tx.title}`}><Icon name="edit" size={17} /></button>
                    <button className="icon-btn danger" onClick={() => onDelete(tx)} aria-label={`Delete ${tx.title}`}><Icon name="trash" size={17} /></button>
                </div>
            )}
        </li>
    );
}
