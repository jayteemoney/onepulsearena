import React from 'react';
import ReactDOM from 'react-dom/client';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { networkConfig } from './config/sui';
import App from './App';
import '@mysten/dapp-kit/dist/index.css';
import './index.css';

// Suppress non-critical console errors
const originalError = console.error;
console.error = (...args: any[]) => {
  const errorMsg = args.join(' ');

  // Suppress MetaMask errors (not relevant for Sui dApp)
  if (errorMsg.includes('MetaMask') || errorMsg.includes('metamask')) {
    return;
  }

  // Suppress Sentry errors (analytics blocked by ad blockers)
  if (errorMsg.includes('sentry')) {
    return;
  }

  // Call original console.error for all other errors
  originalError.apply(console, args);
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
