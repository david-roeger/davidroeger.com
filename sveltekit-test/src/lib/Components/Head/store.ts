import { writable } from 'svelte/store';
import type { DefaultSeoProps } from './types';

export const defaultSeoProps: DefaultSeoProps = {
	title: writable(undefined),
	titleTemplate: writable(undefined),
	noindex: writable(undefined),
	nofollow: writable(undefined),
	robotsProps: writable(undefined),
	description: writable(undefined),
	canonical: writable(undefined),
	mobileAlternate: writable(undefined),
	languageAlternates: writable(undefined),
	openGraph: writable(undefined),
	facebook: writable(undefined),
	twitter: writable(undefined),
	additionalMetaTags: writable(undefined),
	additionalLinkTags: writable(undefined),
};
