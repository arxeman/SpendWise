export const EXPENSE_CATEGORIES = ["Food", "Travel", "Shopping", "Education", "Entertainment", "Bills", "Health", "Other"];
export const INCOME_CATEGORIES = ["Salary", "Pocket money", "Freelance", "Gift", "Other"];

export const CATEGORY_META = {
    Food: { color: "#F2740B", icon: "utensils" },
    Travel: { color: "#2F7BF5", icon: "plane" },
    Shopping: { color: "#9B5CF6", icon: "bag" },
    Education: { color: "#0FA3A3", icon: "book" },
    Entertainment: { color: "#E8438F", icon: "play" },
    Bills: { color: "#C9930A", icon: "receipt" },
    Health: { color: "#E5484D", icon: "heart" },
    Salary: { color: "#0E9F7E", icon: "briefcase" },
    "Pocket money": { color: "#3E9B3E", icon: "wallet" },
    Freelance: { color: "#4F5BD5", icon: "laptop" },
    Gift: { color: "#D6409F", icon: "gift" },
    Other: { color: "#6B7794", icon: "dots" }
};

export const metaFor = (category) =>
    CATEGORY_META[category] || { color: "#6B7794", icon: "dots" };

export const categoriesFor = (type) =>
    type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
