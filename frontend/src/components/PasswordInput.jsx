import { useState } from "react";
import Icon from "./Icon";

export default function PasswordInput(props) {
    const [show, setShow] = useState(false);
    return (
        <div className="pw">
            <input {...props} type={show ? "text" : "password"} className="input" />
            <button type="button" className="icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
                <Icon name={show ? "eyeOff" : "eye"} size={18} />
            </button>
        </div>
    );
}
