import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children, allowedRoles }) {
    const { user, token } = useAuth();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return children;
}

export default ProtectedRoute;