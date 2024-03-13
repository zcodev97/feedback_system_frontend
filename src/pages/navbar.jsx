import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Loading from "./loading";
// db password Qymbg5QhNbAzRn!

function NavBar() {
  const navigate = useNavigate();

  let navLinkClassName = "nav-link text-dark rounded border";

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    localStorage.clear();

    setLoading(false);
    navigate("/login", { replace: true });
  }

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      <nav
        className="navbar navbar-expand-sm navbar-dark  text-center rounded p-2"
        id="no-print"
      >
        <div
          className="container-fluid"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            margin: "0px",
            padding: "0px",
          }}
        >
          {/* Start of the main navbar content */}
          <div className="contaier-fluid">
            <button
              className="navbar-toggler bg-dark text-end"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/vendors">
                  <h5>Vendors</h5>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/payments">
                  <h5>Payments</h5>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/paid_orders">
                  <h5>Paid Orders</h5>
                </Link>
              </li>

              <li className="nav-item btn m-1 p-2 border border-1 rounded">
                👤<b> {localStorage.getItem("username")}</b>
              </li>
              <li className="nav-item rounded m-1">
                <Link
                  className="nav-link text-light bg-danger rounded p-2 border border-3 border-danger"
                  to="/login"
                  onClick={handleLogout}
                >
                  <b>Sign Out</b>
                </Link>
              </li>
            </ul>
          </div>
          {/* End of the main navbar content */}

          {/* Start of user/logout buttons */}

          {/* End of user/logout buttons */}
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default NavBar;
