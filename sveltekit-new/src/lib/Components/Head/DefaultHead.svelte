<script lang="ts">
	import type {
		AdditionalRobotsProps,
		MobileAlternate,
		LanguageAlternate,
		OpenGraph,
		Twitter,
		MetaTag,
		LinkTag
	} from './types';
	import { defaultSeoProps } from './store';

	export let title: string | undefined = undefined;
	export let titleTemplate: string | undefined = undefined;
	export let noindex = false;
	export let nofollow = false;
	export let robotsProps: AdditionalRobotsProps | undefined = undefined;
	export let description: string | undefined = undefined;
	export let canonical: string | undefined = undefined;
	export let mobileAlternate: MobileAlternate | undefined = undefined;
	export let languageAlternates: LanguageAlternate[] | undefined = undefined;
	export let openGraph: OpenGraph | undefined = undefined;
	export let facebook: { appId: string } | undefined = undefined;
	export let twitter: Twitter | undefined = undefined;
	export let additionalMetaTags: MetaTag[] | undefined = undefined;
	export let additionalLinkTags: LinkTag[] | undefined = undefined;

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
		additionalLinkTags: defaultAdditionalLinkTags
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
</script>

<slot />
