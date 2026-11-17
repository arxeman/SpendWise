import { useCallback, useEffect, useMemo, useState } from "react";
import { TransactionsCtx as Ctx } from "./transactionsStore";
import API from "../services/api";

export function TransactionsProvider({ children }) {
    const [raw, setRaw] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const refresh = useCallback(async () => {
        try {
            const { data } = await API.get("/transactions");
            setRaw(data.data);
            setError("");
        } catch (e) {
            setError(e.response?.data?.message || "Can't reach the server. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let live = true;
        API.get("/transactions")
            .then(({ data }) => { if (live) { setRaw(data.data); setError(""); } })
            .catch((e) => { if (live) setError(e.response?.data?.message || "Can't reach the server. Check your connection and try again."); })
            .finally(() => { if (live) setLoading(false); });
        return () => { live = false; };
    }, []);

    const add = async (payload) => { await API.post("/transactions", payload); await refresh(); };
    const update = async (id, payload) => { await API.put(`/transactions/${id}`, payload); await refresh(); };
    const remove = async (id) => { await API.delete(`/transactions/${id}`); await refresh(); };

    const items = useMemo(
        () => [...raw].sort(
            (a, b) =>
                new Date(b.date) - new Date(a.date) ||
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        ),
        [raw]
    );

    return (
        <Ctx.Provider value={{ items, loading, error, refresh, add, update, remove }}>
            {children}
        </Ctx.Provider>
    );
}
