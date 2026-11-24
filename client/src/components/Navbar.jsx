import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import { useSelector,useDispatch } from "react-redux";
import { logout } from "../app/features/auth/authActions.js";

function Navbar() {
    // const { user, logout } = useAuth();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
    const navigate = useNavigate();
    const isAdmin = user?.role === "admin";

    const handleLogout = () => {
        // logout();
        dispatch(logout());
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
        `library-navbar-link${isActive ? " active" : ""}`;

    return (
        <header className="library-navbar">
            <NavLink className="library-navbar-brand" to={isAdmin ? "/dashboard" : "/books"}>
                <span>Library Manager</span>
            </NavLink>

            <nav className="library-navbar-links" aria-label="Main navigation">
                {isAdmin && (
                    <NavLink className={navLinkClass} to="/dashboard">
                        Dashboard
                    </NavLink>
                )}
                <NavLink className={navLinkClass} to="/books">
                    {isAdmin ? "Books" : "Borrow books"}
                </NavLink>
                {isAdmin && (
                    <>
                        <NavLink className={navLinkClass} to="/authors">
                            Authors
                        </NavLink>
                        <NavLink className={navLinkClass} to="/borrows">
                            Borrows
                        </NavLink>
                    </>
                )}
                <button className="library-navbar-logout" type="button" onClick={handleLogout}>
                    Logout
                </button>
            </nav>
        </header>
    );
}

export default Navbar;
