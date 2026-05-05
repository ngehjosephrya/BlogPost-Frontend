import { useContext } from "react";
import { AuthContext } from "../../src/context/authContext";

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used withtin an AuthProvideer")
    }

    return context;
}