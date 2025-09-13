import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OrganizationApp from "./OrganizationPages/OrganizationApp";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/organization/:orgId/*" element={<OrganizationApp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default withAuthenticator(App);
