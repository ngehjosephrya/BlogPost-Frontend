import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuths";

export function ProtectedRoute() {
    const {isAuthenticated, isLoading} = useAuth();

    if(isLoading) {
        return (
            <div className="flex item-center justify-center min-h-screen">
                <span className="text-gray-500 text-sm">Loading...</span>
            </div>
        );
    }

    if(!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />
}