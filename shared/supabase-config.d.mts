type Env = Record<string, string | undefined>;
export function authKeyName(env: Env, prefix?: '' | 'VITE_'): string;
export function publicAuthKey(value: string | undefined): string;
export function authUrl(value: string): string;
export function authConfig(env: Env, prefix?: '' | 'VITE_'): { url: string; key: string } | null;
