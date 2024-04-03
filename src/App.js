import NoPage from "./pages/NoPage";
import LoginPage from "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FeedbackRecordsPage from "./pages/vendors/records";
import AddFeedBackPage from "./pages/vendors/add";
import FeedBackReportsPage from "./pages/vendors/reports";

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
                  <AddFeedBackPage />
                )
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/feedbacks" element={<FeedbackRecordsPage />} />
            <Route path="/create_feedback" element={<AddFeedBackPage />} />
            <Route path="/feedback_report" element={<FeedBackReportsPage />} />

            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
