import { useEffect, useReducer } from "react";
import { DashboardContext } from "./Contexts";
import { getToken, removeToken } from "@/action/token";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Extend the AppState to include a user
export type AppState = {
    open: boolean;
    pageActions: React.ReactNode | null; // Add the user property
    breadcrumbLinks: Links[] | null; // Add the user property
    user?: any
};

type Links = {
    label: string;
    link?: string; // Add the user property
};

// Add the SET_USER action to the AppAction type
export type AppAction =
    | { type: "SET_OPEN"; payload: boolean }
    | { type: "SET_PAGE_ACTIONS"; payload: React.ReactNode | null } // New action type
    | { type: "SET_BREADCRUMB_LINKS"; payload: Links[] } // New action type
    | { type: "UPDATE_STATE"; payload: Partial<AppState> } // Support multiple updates
    | { type: "RESET_STATE"; }; // Support multiple updates

// Modify the reducer to handle the SET_USER action
const reducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case "SET_OPEN":
            localStorage.setItem("drawer", action.payload.toString());
            return { ...state, open: action.payload };
        case "SET_PAGE_ACTIONS":
            return { ...state, pageActions: action.payload }; // Handle the new case
        case "SET_BREADCRUMB_LINKS":
            return { ...state, breadcrumbLinks: action.payload }; // Handle the new case
        case "UPDATE_STATE":
            return { ...state, ...action.payload };
        case "RESET_STATE":
            return { ...state, breadcrumbLinks: [], pageActions: null };
        default:
            throw new Error("Unhandled action type");
    }
};

// Update the provider to initialize with user state as well
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, {
        open: localStorage.getItem("drawer") === "false" ? false : true,
        pageActions: null,
        breadcrumbLinks: [],
    });

    return (
        <DashboardContext.Provider value={{ state, dispatch }}>
            {children}
        </DashboardContext.Provider>
    );
};

// Create the context as before
// export const DashboardContext = createContext<{
//     state: AppState;
//     dispatch: React.Dispatch<AppAction>;
// } | undefined>(undefined);
// Use context hook
// export const useAppContext = () => {
//     const context = useContext(DashboardContext);
//     if (!context) {
//         throw new Error("useAppContext must be used within a DashboardProvider");
//     }
//     return context;
// };
