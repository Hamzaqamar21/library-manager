import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";

import { useSelector } from "react-redux";

function ProtectedRoute({ children, allowedRoles }) {
    // const { user, token } = useAuth();
    const { user, token } = useSelector((state) => state.auth);

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return children;
}

export default ProtectedRoute;