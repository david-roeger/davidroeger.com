<script lang="ts">
	import type {
		AdditionalRobotsProps,
		MobileAlternate,
		LanguageAlternate,
		OpenGraph,
		Twitter,
		MetaTag,
		LinkTag,
		Tags,
	} from './types';
	import { defaultSeoProps } from './store';
	import buildTags from './utils';

	export let title: string = undefined;
	export let titleTemplate: string = undefined;
	export let noindex: boolean = false;
	export let nofollow: boolean = false;
	export let robotsProps: AdditionalRobotsProps = undefined;
	export let description: string = undefined;
	export let canonical: string = undefined;
	export let mobileAlternate: MobileAlternate = undefined;
	export let languageAlternates: ReadonlyArray<LanguageAlternate> = undefined;
	export let openGraph: OpenGraph = undefined;
	export let facebook: { appId: string } = undefined;
	export let twitter: Twitter = undefined;
	export let additionalMetaTags: ReadonlyArray<MetaTag> = undefined;
	export let additionalLinkTags: ReadonlyArray<LinkTag> = undefined;

	const {
		title: defaultTitle,
		titleTemplate: defaultTitleTemplate,
		noindex: defaultNoIndex,
		nofollow: defaultNoFollow,
		robotsProps: defaultRobotsProps,
		description: defaultDescription,
		canonical: defaultCanonical,
		mobileAlternate: defaultMobileAlternate,
		languageAlternates: defaultLanguageAlternates,
		openGraph: defaultOpenGraph,
		facebook: defaultFacebook,
		twitter: defaultTwitter,
		additionalMetaTags: defaultAdditionalMetaTags,
		additionalLinkTags: defaultAdditionalLinkTags,
	} = defaultSeoProps;

	$defaultTitle = title;
	$defaultTitleTemplate = titleTemplate;
	$defaultNoIndex = noindex;
	$defaultNoFollow = nofollow;
	$defaultRobotsProps = robotsProps;
	$defaultDescription = description;
	$defaultCanonical = canonical;
	$defaultMobileAlternate = mobileAlternate;
	$defaultLanguageAlternates = languageAlternates;
	$defaultOpenGraph = openGraph;
	$defaultFacebook = facebook;
	$defaultTwitter = twitter;
	$defaultAdditionalMetaTags = additionalMetaTags;
	$defaultAdditionalLinkTags = additionalLinkTags;

	$: $defaultTitle = title;
	$: $defaultTitleTemplate = titleTemplate;
	$: $defaultNoIndex = noindex;
	$: $defaultNoFollow = nofollow;
	$: $defaultRobotsProps = robotsProps;
	$: $defaultDescription = description;
	$: $defaultCanonical = canonical;
	$: $defaultMobileAlternate = mobileAlternate;
	$: $defaultLanguageAlternates = languageAlternates;
	$: $defaultOpenGraph = openGraph;
	$: $defaultFacebook = facebook;
	$: $defaultTwitter = twitter;
	$: $defaultAdditionalMetaTags = additionalMetaTags;
	$: $defaultAdditionalLinkTags = additionalLinkTags;

	$: console.log('update prop	', title);
	$: console.log('update store	', $defaultTitle);
</script>

<slot />
