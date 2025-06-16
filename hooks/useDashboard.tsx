import { useContext } from 'react';
import { DashboardContext } from '../context/Contexts';

// ==============================|| CONFIG - HOOKS ||============================== //

export default function useDashboard() {
    const data = useContext(DashboardContext);
    return data
}
