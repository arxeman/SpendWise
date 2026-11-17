import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await API.post("/auth/login", form);
            const { token, id, name, email } = data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ id, name, email }));
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Can't reach the server. Try again in a moment.");
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to see your balance and recent activity."
            footer={<>New here? <Link to="/register">Create an account</Link></>}
        >
            <form onSubmit={onSubmit} className="auth-fields">
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" className="input" type="email" name="email" autoComplete="email" value={form.email} onChange={onChange} required />
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <PasswordInput id="password" name="password" autoComplete="current-password" value={form.password} onChange={onChange} required />
                </div>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
                    {loading ? "Logging in…" : "Log in"}
                </button>
            </form>
        </AuthLayout>
    );
}

export default Login;
