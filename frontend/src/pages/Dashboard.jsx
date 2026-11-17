import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Icon from "../components/Icon";
import TxRow from "../components/TxRow";
import { Donut, MonthBars, Sparkline } from "../components/Charts";
import { useTransactions } from "../context/transactionsStore";
import { metaFor } from "../utils/categories";
import { dateKey, getUser, greeting, inr, localTodayKey, monthKey, monthLabel, shiftDay, shiftMonth } from "../utils/format";

function useCountUp(target, ms = 900) {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [v, setV] = useState(0);
    useEffect(() => {
        if (reduced) return;
        let raf;
        const start = performance.now();
        const tick = (t) => {
            const p = Math.min((t - start) / ms, 1);
            setV(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, ms, reduced]);
    return reduced ? target : v;
}

function Delta({ now, prev, goodWhenUp }) {
    if (!prev) return <span className="delta flat">No data last month</span>;
    const pct = Math.round(((now - prev) / prev) * 100);
    if (pct === 0) return <span className="delta flat">Same as last month</span>;
    const up = pct > 0;
    const good = up === goodWhenUp;
    return (
        <span className={`delta ${good ? "good" : "bad"}`}>
            <Icon name={up ? "up" : "down"} size={14} /> {Math.abs(pct)}% vs last month
        </span>
    );
}

function Dashboard() {
    const { items, loading, error, refresh } = useTransactions();
    const { openAdd, openEdit, askDelete } = useOutletContext();
    const user = getUser();
    const firstName = (user?.name || "there").split(" ")[0];

    const d = useMemo(() => {
        const today = localTodayKey();
        const thisMonth = today.slice(0, 7);
        const lastMonth = shiftMonth(thisMonth, -1);
        const signed = (t) => (t.type === "income" ? t.amount : -t.amount);

        const totalIncome = items.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const totalExpense = items.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        const balance = totalIncome - totalExpense;

        // 30-day running balance
        const days = Array.from({ length: 30 }, (_, i) => shiftDay(today, i - 29));
        let run = items.filter((t) => dateKey(t.date) < days[0]).reduce((s, t) => s + signed(t), 0);
        const byDay = {};
        items.forEach((t) => { const k = dateKey(t.date); byDay[k] = (byDay[k] || 0) + signed(t); });
        const series = days.map((k) => (run += byDay[k] || 0));

        const sumFor = (mk, type) =>
            items.filter((t) => t.type === type && monthKey(t.date) === mk).reduce((s, t) => s + t.amount, 0);

        const monthIncome = sumFor(thisMonth, "income");
        const monthExpense = sumFor(thisMonth, "expense");

        const cats = {};
        items.filter((t) => t.type === "expense" && monthKey(t.date) === thisMonth)
            .forEach((t) => (cats[t.category] = (cats[t.category] || 0) + t.amount));
        const donut = Object.entries(cats)
            .map(([name, value]) => ({ name, value, color: metaFor(name).color }))
            .sort((a, b) => b.value - a.value);

        const bars = Array.from({ length: 6 }, (_, i) => {
            const key = shiftMonth(thisMonth, i - 5);
            return { key, label: monthLabel(key, "short"), income: sumFor(key, "income"), expense: sumFor(key, "expense"), current: key === thisMonth };
        });

        return {
            thisMonth, balance, totalIncome, totalExpense, series, monthIncome, monthExpense,
            prevIncome: sumFor(lastMonth, "income"), prevExpense: sumFor(lastMonth, "expense"),
            donut, bars, hasBars: bars.some((b) => b.income || b.expense),
            change30: series[series.length - 1] - series[0]
        };
    }, [items]);

    const shownBalance = useCountUp(d.balance);

    if (loading) return <DashboardSkeleton />;

    if (error) {
        return (
            <div className="state-card">
                <h2>Couldn't load your data</h2>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={refresh}>Try again</button>
            </div>
        );
    }

    const kept = d.monthIncome > 0 ? Math.round(((d.monthIncome - d.monthExpense) / d.monthIncome) * 100) : null;

    return (
        <>
            <header className="page-head">
                <div>
                    <h1>{greeting()}, {firstName}</h1>
                    <p>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
                </div>
            </header>

            <div className="grid">
                <section className="hero">
                    <div className="hero-top">
                        <span className="hero-label">Available balance</span>
                        <div className="hero-amount">{inr(Math.round(shownBalance * 100) / 100)}</div>
                        <div className="hero-sub">
                            <span><Icon name="up" size={14} /> {inr(d.totalIncome)} earned</span>
                            <span><Icon name="down" size={14} /> {inr(d.totalExpense)} spent</span>
                        </div>
                    </div>
                    <div className="hero-chart">
                        <Sparkline values={d.series} />
                        <div className="hero-caption">
                            <span>Last 30 days</span>
                            <b className={d.change30 >= 0 ? "up" : "down"}>{d.change30 >= 0 ? "+" : "−"}{inr(Math.abs(d.change30))}</b>
                        </div>
                    </div>
                </section>

                <div className="stat-col">
                    <section className="card stat">
                        <span className="stat-icon in"><Icon name="up" size={18} /></span>
                        <div>
                            <small>Income in {monthLabel(d.thisMonth, "long").split(" ")[0]}</small>
                            <strong>{inr(d.monthIncome)}</strong>
                            <Delta now={d.monthIncome} prev={d.prevIncome} goodWhenUp />
                        </div>
                    </section>
                    <section className="card stat">
                        <span className="stat-icon out"><Icon name="down" size={18} /></span>
                        <div>
                            <small>Spent in {monthLabel(d.thisMonth, "long").split(" ")[0]}</small>
                            <strong>{inr(d.monthExpense)}</strong>
                            <Delta now={d.monthExpense} prev={d.prevExpense} goodWhenUp={false} />
                        </div>
                    </section>
                </div>

                <section className="card span-7">
                    <div className="card-head">
                        <h2>Income vs spending</h2>
                        <div className="key"><span><i className="sw in" />Income</span><span><i className="sw out" />Spent</span></div>
                    </div>
                    {d.hasBars ? <MonthBars data={d.bars} /> : <EmptyNote text="Add a few transactions to see six months of trends." />}
                </section>

                <section className="card span-5">
                    <div className="card-head">
                        <h2>Where it went</h2>
                        {kept !== null && <span className="pill">{kept >= 0 ? `Kept ${kept}% of income` : "Spent more than earned"}</span>}
                    </div>
                    {d.donut.length ? <Donut data={d.donut} total={d.monthExpense} /> : <EmptyNote text="No spending logged this month." />}
                </section>

                <section className="card span-12">
                    <div className="card-head">
                        <h2>Recent activity</h2>
                        {items.length > 0 && <Link to="/transactions" className="link">View all</Link>}
                    </div>
                    {items.length === 0 ? (
                        <div className="empty">
                            <h3>Nothing here yet</h3>
                            <p>Add your first income or expense and your dashboard fills in.</p>
                            <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={18} /> Add transaction</button>
                        </div>
                    ) : (
                        <ul className="tx-list">
                            {items.slice(0, 6).map((t) => (
                                <TxRow key={t._id} tx={t} showDate onEdit={openEdit} onDelete={askDelete} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}

function EmptyNote({ text }) {
    return <p className="empty-note">{text}</p>;
}

function DashboardSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading">
            <div className="sk" style={{ height: 34, width: 280, marginBottom: 28 }} />
            <div className="grid">
                <div className="sk hero-sk" />
                <div className="stat-col"><div className="sk" style={{ height: 112 }} /><div className="sk" style={{ height: 112 }} /></div>
                <div className="sk span-7" style={{ height: 300 }} />
                <div className="sk span-5" style={{ height: 300 }} />
            </div>
        </div>
    );
}

export default Dashboard;
