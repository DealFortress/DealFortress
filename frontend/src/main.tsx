import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-3ajyy6n01s37rnev.eu.auth0.com"
      clientId="rXQINGs97eUOheZ0dzEAlXdZIGiQbla8"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools />
        </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
