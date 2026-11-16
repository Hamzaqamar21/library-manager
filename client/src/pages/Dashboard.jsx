import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-navbar">
        <Link className="dashboard-brand" to="/dashboard">
          <span>Library Manager</span>
        </Link>

        <nav className="dashboard-nav-links" aria-label="Main navigation">
          <Link className="dashboard-nav-link active" to="/dashboard">
            Dashboard
          </Link>
          <Link className="dashboard-nav-link" to="/books">
            Books
          </Link>
          <Link className="dashboard-nav-link" to="/authors">
            Authors
          </Link>
          <button className="dashboard-logout-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <div>
            <h1>Welcome{user?.name ? `, ${user.name}` : ""}!</h1>
            <p>Manage your books </p>
          </div>
          <Link className="dashboard-primary-button" to="/books">
            Browse books
          </Link>
        </section>

        <section className="dashboard-stats" aria-label="Library statistics">
          <article className="dashboard-stat-card">
            <div>
              <p>Total books</p>
              <strong>Library collection</strong>
            </div>
          </article>
          <article className="dashboard-stat-card">
            <div>
              <p>Available now</p>
              <strong>Ready to borrow</strong>
            </div>
          </article>
        </section>

        <div className="dashboard-welcome-cards">
          <section className="dashboard-welcome-card">
            <h2>Get started</h2>
            <p>Open the books page to add, view, and manage your library collection.</p>
            <Link className="dashboard-secondary-button" to="/books">
              Manage books
            </Link>
          </section>

          <section className="dashboard-welcome-card">
            <h2>Manage authors</h2>
            <p>Open the authors page to add and view the authors in your library.</p>
            <Link className="dashboard-secondary-button" to="/authors">
              Manage authors
            </Link>
          </section>
        </div>
      </main>

      <footer className="dashboard-footer">
        <span>Library management</span>
      </footer>
    </div>
  );
}

export default Dashboard;   