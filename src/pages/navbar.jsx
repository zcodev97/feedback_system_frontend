import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Loading from "./loading";
// db password Qymbg5QhNbAzRn!
import "@flaticon/flaticon-uicons/css/all/all.css";
function NavBar() {
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = useState("");
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  let navLinkClassName = "nav-link text-light";

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
        className="navbar navbar-expand-sm bg-dark  navbar-dark  text-center rounded p-2"
        id="no-print"
      >
        <div
          className="container-fluid"
          style={{
            display: "flex",
            color: "white",
            flexDirection: "row-reverse",
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
                <Link className={navLinkClassName} to="/create_feedback">
                  <h5>انشاء</h5>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/feedbacks">
                  <h5>الادخالات</h5>
                </Link>
              </li>
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/feedback_report">
                  <h5>تقارير</h5>
                </Link>
              </li>

              <li className="nav-item btn m-1 p-2 ">
                <b className="text-light">
                  {" "}
                  {localStorage.getItem("username")}
                </b>
              </li>
              <li className="nav-item rounded m-1">
                <Link
                  className="nav-link text-light bg-danger rounded p-2 border border-3 border-danger"
                  to="/login"
                  onClick={handleLogout}
                >
                  <b>خروج</b>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default NavBar;
