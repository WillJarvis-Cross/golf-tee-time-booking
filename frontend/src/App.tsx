import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Button from "@mui/material/Button";

function App({ signOut, user }: any) {
  return (
    <div>
      <h1>Welcome {user?.username}</h1>
      <Button variant="contained" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}

// HOC adds login/sign-up automatically
export default withAuthenticator(App);
