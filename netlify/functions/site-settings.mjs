import { createNetlifySettingsHandler } from '../../server/netlify-settings.mjs';
import { isLocalMode, cloudDisabledResponse } from '../../server/local-mode.mjs';

// DATA_MODE=local memaksa 503 mode-lokal; auto/cloud melayani handler.
const cloudHandler = createNetlifySettingsHandler();
export const handler = async (event) => (isLocalMode() ? cloudDisabledResponse() : cloudHandler(event));
