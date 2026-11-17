import { Navigate } from "react-router-dom";
import { Logo } from "./Icon";
import Icon from "./Icon";

const SAMPLE = [
    { icon: "utensils", t: "Canteen lunch", c: "Food", a: "−₹120", in: false },
    { icon: "briefcase", t: "Internship stipend", c: "Salary", a: "+₹15,000", in: true },
    { icon: "book", t: "Semester books", c: "Education", a: "−₹1,850", in: false }
];

export default function AuthLayout({ title, subtitle, children, footer }) {
    if (localStorage.getItem("token")) return <Navigate to="/dashboard" replace />;
    return (
        <div className="auth">
            <section className="auth-art">
                <div className="brand light"><Logo /><span>SpendWise</span></div>
                <div className="auth-pitch">
                    <h2>Know where every rupee goes.</h2>
                    <p>Log income and expenses in seconds. See your month at a glance.</p>
                </div>
                <ul className="auth-sample" aria-hidden="true">
                    {SAMPLE.map((s) => (
                        <li key={s.t}>
                            <span className="bubble"><Icon name={s.icon} size={18} /></span>
                            <span className="grow"><b>{s.t}</b><small>{s.c}</small></span>
                            <span className={s.in ? "pos" : ""}>{s.a}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="auth-form">
                <div className="auth-box">
                    <div className="brand auth-mobile-brand"><Logo size={30} /><span>SpendWise</span></div>
                    <h1>{title}</h1>
                    <p className="sub">{subtitle}</p>
                    {children}
                    <p className="auth-foot">{footer}</p>
                </div>
            </section>
        </div>
    );
}
