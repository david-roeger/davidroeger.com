console.info('contact Page: script module call');

import { browser } from '$app/env';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement...
// we need js in the layout...
export const hydrate = false;

// ...but if the client-side router is already loaded
// (i.e. we came here from elsewhere in the app), use it
export const router = browser;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in prod
export const prerender = true;
