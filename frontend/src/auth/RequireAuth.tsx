import { Navigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuthenticator((c) => [c.authStatus]);

  if (authStatus === "configuring")
    return <div style={{ padding: 16 }}>Loading…</div>;

  return authStatus === "authenticated" ? (
    <>{children}</>
  ) : (
    <Navigate to="/login/user" replace />
  );
}
