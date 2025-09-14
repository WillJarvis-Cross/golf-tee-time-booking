import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import { RequireAuth } from "./auth/RequireAuth";
import { UserLogin } from "./auth/UserLogin";
import { OrgLogin } from "./auth/OrgLogin";
import { UserDashboard } from "./UserPages/UserDashboard";
import { OrgChooser } from "./OrganizationPages/OrgChooser";
import { OrgOnboarding } from "./OrganizationPages/OrgOnboarding";
import OrganizationApp from "./OrganizationPages/OrganizationApp";

export default function App() {
  return (
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/org" element={<OrgLogin />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <UserDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/organizations"
            element={
              <RequireAuth>
                <OrgChooser />
              </RequireAuth>
            }
          />
          <Route
            path="/organization/:orgId/*"
            element={
              <RequireAuth>
                <OrganizationApp />
              </RequireAuth>
            }
          />
          <Route
            path="/organizations/new"
            element={
              <RequireAuth>
                <OrgOnboarding />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  );
}
