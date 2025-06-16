export const getStoredVisibility = (key: string): Record<string, boolean> => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

export const setStoredVisibility = (
    visibility: Record<string, boolean>,
    key: string
) => {
    localStorage.setItem(key, JSON.stringify(visibility));
};