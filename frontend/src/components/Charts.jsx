import { useState } from "react";
import { compactINR, inr } from "../utils/format";

export function Sparkline({ values, height = 96 }) {
    const w = 600;
    const pad = 6;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const pts = values.map((v, i) => [
        pad + (i / (values.length - 1 || 1)) * (w - pad * 2),
        pad + (1 - (v - min) / span) * (height - pad * 2)
    ]);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    const area = `${line} L${pts[pts.length - 1][0]} ${height} L${pts[0][0]} ${height} Z`;
    const last = pts[pts.length - 1];
    return (
        <svg className="spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" role="img" aria-label="Balance over the last 30 days">
            <defs>
                <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7C93FF" stopOpacity=".45" />
                    <stop offset="1" stopColor="#7C93FF" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill="url(#sparkfill)" />
            <path d={line} fill="none" stroke="#9FB0FF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <circle cx={last[0]} cy={last[1]} r="5" fill="#fff" stroke="#2F4BFF" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
    );
}

export function Donut({ data, total }) {
    const [hover, setHover] = useState(null);
    const r = 68;
    const c = 2 * Math.PI * r;
    const starts = data.reduce((acc, d, i) => [...acc, i === 0 ? 0 : acc[i - 1] + (data[i - 1].value / total) * c], []);
    const active = data.find((d) => d.name === hover);
    return (
        <div className="donut-wrap">
            <svg viewBox="0 0 180 180" className="donut" role="img" aria-label="Spending by category">
                <circle cx="90" cy="90" r={r} fill="none" stroke="var(--line)" strokeWidth="20" />
                {data.map((d, i) => {
                    const len = (d.value / total) * c;
                    const gap = data.length > 1 ? 3 : 0;
                    return (
                        <circle
                            key={d.name}
                            cx="90" cy="90" r={r}
                            fill="none"
                            stroke={d.color}
                            strokeWidth={hover === d.name ? 24 : 20}
                            strokeDasharray={`${Math.max(len - gap, 0.5)} ${c}`}
                            strokeDashoffset={-starts[i]}
                            transform="rotate(-90 90 90)"
                            style={{ transition: "stroke-width .15s", opacity: hover && hover !== d.name ? 0.35 : 1 }}
                            onMouseEnter={() => setHover(d.name)}
                            onMouseLeave={() => setHover(null)}
                        />
                    );
                })}
                <text x="90" y="84" textAnchor="middle" className="donut-sub">{active ? active.name : "Spent"}</text>
                <text x="90" y="106" textAnchor="middle" className="donut-total">{compactINR(active ? active.value : total)}</text>
            </svg>
            <ul className="legend">
                {data.map((d) => (
                    <li
                        key={d.name}
                        onMouseEnter={() => setHover(d.name)}
                        onMouseLeave={() => setHover(null)}
                        className={hover === d.name ? "on" : ""}
                    >
                        <span className="dot" style={{ background: d.color }} />
                        <span className="legend-name">{d.name}</span>
                        <span className="legend-val">{inr(d.value)}</span>
                        <span className="legend-pct">{Math.round((d.value / total) * 100)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function MonthBars({ data }) {
    const W = 560, H = 230, L = 46, B = 28, T = 10;
    const rawMax = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);
    const mag = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const max = Math.ceil(rawMax / mag) * mag;
    const ticks = [0, 0.5, 1].map((t) => t * max);
    const plotH = H - B - T;
    const slot = (W - L) / data.length;
    const bw = Math.min(20, slot / 3);
    const y = (v) => T + plotH - (v / max) * plotH;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="bars" role="img" aria-label="Income and spending for the last six months">
            {ticks.map((t) => (
                <g key={t}>
                    <line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray={t ? "3 4" : ""} />
                    <text x={L - 8} y={y(t) + 4} textAnchor="end" className="axis">{t ? compactINR(t) : "0"}</text>
                </g>
            ))}
            {data.map((d, i) => {
                const cx = L + slot * i + slot / 2;
                return (
                    <g key={d.key}>
                        <rect x={cx - bw - 2} y={y(d.income)} width={bw} height={Math.max(plotH - (y(d.income) - T), 0)} rx="5" fill="var(--income)">
                            <title>{`${d.label} income: ${inr(d.income)}`}</title>
                        </rect>
                        <rect x={cx + 2} y={y(d.expense)} width={bw} height={Math.max(plotH - (y(d.expense) - T), 0)} rx="5" fill="var(--expense)">
                            <title>{`${d.label} spent: ${inr(d.expense)}`}</title>
                        </rect>
                        <text x={cx} y={H - 8} textAnchor="middle" className={`axis ${d.current ? "axis-now" : ""}`}>{d.label}</text>
                    </g>
                );
            })}
        </svg>
    );
}
