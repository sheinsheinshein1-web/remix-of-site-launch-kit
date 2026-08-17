/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PARTNER_APPLICATION_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
