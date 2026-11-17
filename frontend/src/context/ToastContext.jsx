import { useCallback, useRef, useState } from "react";
import { ToastCtx } from "./toastContext";
import Icon from "../components/Icon";

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const id = useRef(0);

    const push = useCallback((message, kind = "ok") => {
        const key = ++id.current;
        setToasts((t) => [...t, { key, message, kind }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.key !== key)), 3200);
    }, []);

    return (
        <ToastCtx.Provider value={push}>
            {children}
            <div className="toasts" role="status" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.key} className={`toast ${t.kind}`}>
                        <Icon name={t.kind === "error" ? "x" : "check"} size={16} />
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    );
}
