import { Routes, Route , Navigate} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Books from "./pages/Book.jsx";
import Borrows from "./pages/Borrows.jsx";
import Authors from "./pages/Authors.jsx";
import NotFound from "./pages/NotFound.jsx";
import Forbidden from "./pages/Forbidden.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        // <Routes>
        //   <Route path="/" element={<Navigate to="/login" replace />} />

        //   <Route path="/" element={<Home />} />
        //   <Route path="/login" element={<Login />} />
        //   <Route path="/signup" element={<Signup />} />
        //   <Route path="/dashboard" element={<Dashboard />} />
        //   <Route path="/books" element={<Books />} />
        //   <Route path="/borrows" element={<Borrows />} />
        //   <Route path="/authors" element={<Authors />} />
        //   <Route path="*" element={<NotFound />} />

        // </Routes>



      <Routes>

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />


            <Route path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Dashboard />
                    </ProtectedRoute>
                } />

            <Route path="/books"
                element={
                    <ProtectedRoute allowedRoles={["admin", "student"]}>
                        <Books />
                    </ProtectedRoute>
                }  />

            <Route path="/authors"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Authors />
                    </ProtectedRoute>
                }  />


            <Route  path="/borrows"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Borrows />
                    </ProtectedRoute>
                }/>

            <Route path="/403" element={<Forbidden />} />

            <Route path="*" element={<NotFound />} />

        </Routes>

      




    );
}

export default App;