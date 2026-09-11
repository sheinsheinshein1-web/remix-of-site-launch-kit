/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PARTNER_APPLICATION_URL?: string;
  readonly VITE_PROJECT_QUOTE_APPLICATION_URL?: string;
  readonly VITE_REVERSE_GEOCODING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
