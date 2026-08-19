import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { LoginPage } from "./pages/Login";
import { DashboardPage } from "./pages/Dashboard";
import { TicketsPage } from "./pages/Tickets";
import { UsersPage } from "./pages/Users";
import { UnauthorizedPage } from "./pages/Unauthorized";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TicketsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute requiredPermission="manage_users">
            <AppLayout>
              <UsersPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/unauthorized"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UnauthorizedPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
