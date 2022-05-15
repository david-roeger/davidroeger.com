<script lang="ts">
	import Tag from '$lib/Primitives/Tags/Tag.svelte';
	import AccessibleIcon from '../AccessibleIcon';
	import Background from '../Background/Background.svelte';
	import Atom from '../Music/Atom.svelte';
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
	import buildTags from './utils';

	export let title: string;
	export let titleTemplate: string;
	export let defaultTitle: string;
	export let noindex: boolean;
	export let nofollow: boolean;
	export let robotsProps: AdditionalRobotsProps;
	export let description: string;
	export let canonical: string;
	export let mobileAlternate: MobileAlternate;
	export let languageAlternates: ReadonlyArray<LanguageAlternate>;
	export let openGraph: OpenGraph;
	export let facebook: { appId: string };
	export let twitter: Twitter;
	export let additionalMetaTags: ReadonlyArray<MetaTag>;
	export let additionalLinkTags: ReadonlyArray<LinkTag>;

	const tags =
		buildTags({
			title,
			titleTemplate,
			defaultTitle,
			noindex,
			nofollow,
			robotsProps,
			description,
			canonical,
			mobileAlternate,
			languageAlternates,
			openGraph,
			facebook,
			twitter,
			additionalMetaTags,
			additionalLinkTags,
		}) ?? [];
</script>

<svelte:head>
	{#each tags as tagObj (tagObj.key)}
		{@const { tag, key, slot, ...props } = tagObj}
		{#if slot}
			<svelte:element this={tag} {...props}>{slot}</svelte:element>
		{:else}
			<svelte:element this={tag} {...props} />
		{/if}
	{/each}
</svelte:head>
