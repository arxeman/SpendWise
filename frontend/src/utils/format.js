export function inr(amount = 0) {
    const n = Number(amount) || 0;
    const whole = Number.isInteger(n);
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: whole ? 0 : 2,
        maximumFractionDigits: 2
    }).format(n);
}

export function compactINR(n) {
    return "₹" + new Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(n);
}

// Dates are stored as UTC midnight, so always read them in UTC.
export const dateKey = (d) => new Date(d).toISOString().slice(0, 10);
export const monthKey = (d) => dateKey(d).slice(0, 7);

export function localTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function shiftDay(key, delta) {
    const d = new Date(key + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + delta);
    return d.toISOString().slice(0, 10);
}

export function shiftMonth(key, delta) {
    const [y, m] = key.split("-").map(Number);
    const d = new Date(Date.UTC(y, m - 1 + delta, 1));
    return d.toISOString().slice(0, 7);
}

export function monthLabel(key, style = "long") {
    const [y, m] = key.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-IN", {
        month: style,
        year: style === "long" ? "numeric" : undefined,
        timeZone: "UTC"
    });
}

export function dayLabel(key) {
    const today = localTodayKey();
    if (key === today) return "Today";
    if (key === shiftDay(today, -1)) return "Yesterday";
    return new Date(key + "T00:00:00Z").toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: key.slice(0, 4) === today.slice(0, 4) ? undefined : "numeric",
        timeZone: "UTC"
    });
}

export function greeting() {
    const h = new Date().getHours();
    if (h < 5) return "Up late";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

export function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
        return null;
    }
}
