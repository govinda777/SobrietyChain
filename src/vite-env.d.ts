/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THIRDWEB_CLIENT_ID: string;
  readonly VITE_EDITION_DROP_ADDRESS: string;
  readonly VITE_ACTIVE_CHAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
