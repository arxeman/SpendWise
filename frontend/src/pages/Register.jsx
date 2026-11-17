import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import { useToast } from "../context/toastContext";

function Register() {
    const navigate = useNavigate();
    const toast = useToast();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await API.post("/auth/register", form);
            toast("Account created. Log in to continue.");
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Can't reach the server. Try again in a moment.");
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Takes under a minute. Your data stays private to you."
            footer={<>Already have an account? <Link to="/login">Log in</Link></>}
        >
            <form onSubmit={onSubmit} className="auth-fields">
                <div className="field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" className="input" name="name" autoComplete="name" value={form.name} onChange={onChange} required />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" className="input" type="email" name="email" autoComplete="email" value={form.email} onChange={onChange} required />
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <PasswordInput id="password" name="password" autoComplete="new-password" minLength={6} value={form.password} onChange={onChange} required />
                    <small className="hint">At least 6 characters.</small>
                </div>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
                    {loading ? "Creating account…" : "Create account"}
                </button>
            </form>
        </AuthLayout>
    );
}

export default Register;
