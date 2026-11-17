import { createContext, useContext } from "react";

export const TransactionsCtx = createContext(null);
export const useTransactions = () => useContext(TransactionsCtx);
