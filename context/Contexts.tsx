import { createContext } from "react";
import type { AppAction, AppState } from "./Dashboard";

// Create the context as before
export const DashboardContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);