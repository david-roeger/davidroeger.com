interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly VITE_SPOTIFY_CLIENT_ID: string;
    readonly VITE_SPOTIFY_CLIENT_SECRET: string;
    readonly VITE_SPOTIFY_REFRESH_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
