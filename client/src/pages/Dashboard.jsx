import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";

function Dashboard() {
  // const { user } = useAuth();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="dashboard-page">
      <Navbar />

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

          <section className="dashboard-welcome-card">
            <h2>Borrow books</h2>
            <p>Choose an available book and enter a due date to borrow it.</p>
            <Link className="dashboard-secondary-button" to="/borrows">
              Borrow books
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