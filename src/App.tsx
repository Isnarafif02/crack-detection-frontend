import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import MyHistoryPage from "./components/MyHistoryPage";
import RegisterPage from "./components/RegisterPage";
import ResultPage from "./components/ResultPage";
import UploadPageAuth from "./components/UploadPageAuth";
import { isAuthenticated } from "./utils/auth";
import { ReactNode, ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Protected Route component
function ProtectedRoute({ children }: { children: ReactNode }): ReactElement {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPageAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-history"
          element={
            <ProtectedRoute>
              <MyHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Old routes for backward compatibility (redirect to auth) */}
        <Route
          path="/history"
          element={<Navigate to="/my-history" replace />}
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
