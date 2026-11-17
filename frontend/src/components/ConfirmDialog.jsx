import { useEffect, useRef } from "react";

export default function ConfirmDialog({ title, body, confirmLabel, onConfirm, onCancel }) {
    const cancelRef = useRef(null);
    useEffect(() => {
        cancelRef.current?.focus();
        const onKey = (e) => e.key === "Escape" && onCancel();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onCancel]);

    return (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="cd-title">
                <h2 id="cd-title">{title}</h2>
                <p>{body}</p>
                <div className="dialog-actions">
                    <button ref={cancelRef} className="btn btn-ghost" onClick={onCancel}>Keep it</button>
                    <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}
