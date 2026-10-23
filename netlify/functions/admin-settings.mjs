import { createNetlifySettingsHandler } from '../../server/netlify-settings.mjs';
export const handler = createNetlifySettingsHandler({ admin: true });
