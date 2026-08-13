import "./polyfills.ts";
import React from "react";
import ReactDOM from "react-dom/client";
import "rujira.ui/scss/index.scss";
import App from "./App.tsx";
import "./scss/index.scss";
import { AccountsContext } from "./services/accounts.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AccountsContext>
      <App />
    </AccountsContext>
  </React.StrictMode>
);
