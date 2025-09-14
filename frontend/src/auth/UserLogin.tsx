import { Navigate } from "react-router-dom";
import { Authenticator, ThemeProvider as AmplifyThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const amplifyTheme = {
  name: 'custom-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#e8f5e8',
          80: '#2e7d32',
          90: '#1b5e20',
          100: '#2e7d32'
        }
      }
    },
    radii: {
      small: '12px',
      medium: '12px',
      large: '12px'
    }
  }
};

export function UserLogin() {
  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>User sign in / sign up</h2>
      <AmplifyThemeProvider theme={amplifyTheme}>
        <Authenticator loginMechanisms={["email"]}>
          {({ user }) => {
            if (user) return <Navigate to="/dashboard" replace />;
            return <></>;
          }}
        </Authenticator>
      </AmplifyThemeProvider>
    </div>
  );
}
