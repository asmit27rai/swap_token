import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { AccountProvider } from "./AccountContext";
import { createThirdwebClient, getContract, resolveMethod } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";

const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_CLIENT_ID,
});

export const contract = getContract({
  client,
  chain: defineChain(43113),
  address: import.meta.env.VITE_ADDRESS,
});

const activeChain = "avalanche-fuji";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ThirdwebProvider client={client} contract={contract} activeChain={activeChain}>
        <AccountProvider>
          <App />
        </AccountProvider>
      </ThirdwebProvider>
    </ClerkProvider>
  </StrictMode>
);
