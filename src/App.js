import NoPage from "./pages/NoPage";
import LoginPage from "./pages/login";
import VendorsPage from "./pages/vendors/records";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ContainerDetailsPage from "./pages/vendors/details";
import AddContainerPage from "./pages/vendors/add";
import PaymentsPage from "./pages/withdraws/records";

function App() {
  return (
    <div className="App">
      <div className="container-fluid bg-white" style={{ height: "100vh" }}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                localStorage.getItem("token") === null ||
                localStorage.getItem("token") === undefined ? (
                  <LoginPage />
                ) : (
                  <VendorsPage />
                )
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route
              path="/container_details"
              element={<ContainerDetailsPage />}
            />
            <Route path="/add_container" element={<AddContainerPage />} />

            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
