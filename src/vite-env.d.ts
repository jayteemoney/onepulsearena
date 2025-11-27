/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUI_NETWORK: string;
  readonly VITE_ONECHAIN_RPC_URL: string;
  readonly VITE_ONECHAIN_WS_URL: string;
  readonly VITE_PACKAGE_ID: string;
  readonly VITE_PULSE_VALUE: string;
  readonly VITE_PULSE_COOLDOWN_MS: string;
  readonly VITE_YIELD_RATE: string;
  readonly VITE_GAS_SPONSOR_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
