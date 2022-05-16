<script context="module" lang="ts">
	export let id = 0;
</script>

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
	import { onMount } from 'svelte';

	export let title: string = undefined;
	export let noindex: boolean = undefined;
	export let nofollow: boolean = undefined;
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

	id++;

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

	const mergeObject = (value = {}, defaultValue = {}) => {
		if (
			Object.keys(value).length === 0 &&
			Object.keys(value).length === 0
		) {
			return undefined;
		}
		return {
			...defaultValue,
			...value,
		};
	};

	const serialize = (array = []) =>
		array.map((value) => JSON.stringify(value));

	const mergeArray = (values = [], defaultValues = []) => {
		if (values.length === 0 && defaultValues.length === 0) {
			return undefined;
		}

		const serializedValues = serialize(values);
		const serializedDefaultValues = serialize(defaultValues);

		const mergedArray = [...defaultValues];

		values.forEach((value, i) => {
			const serializedValue = serializedValues[i];
			const index = serializedDefaultValues.indexOf(serializedValue);
			if (index !== -1) {
				mergedArray[index] = value;
			} else {
				mergedArray.push(value);
			}
		});

		return mergedArray;
	};

	$: tags =
		buildTags({
			title: title ?? $defaultTitle,
			titleTemplate: $defaultTitleTemplate,
			noindex: noindex !== undefined ? noindex : $defaultNoIndex,
			nofollow: nofollow !== undefined ? nofollow : $defaultNoFollow,
			robotsProps: mergeObject(robotsProps, $defaultRobotsProps),
			description: description ?? $defaultDescription,
			canonical: canonical ?? $defaultCanonical,
			mobileAlternate: mergeObject(
				mobileAlternate,
				$defaultMobileAlternate,
			) as MobileAlternate,
			languageAlternates: mergeArray(
				languageAlternates as any[],
				$defaultLanguageAlternates as any[],
			) as LanguageAlternate[],
			openGraph: mergeObject(openGraph, $defaultOpenGraph) as OpenGraph,
			facebook: mergeObject(facebook, $defaultFacebook) as {
				appId: string;
			},
			twitter: mergeObject(twitter, $defaultTwitter) as Twitter,
			additionalMetaTags: mergeArray(
				additionalMetaTags as any[],
				$defaultAdditionalMetaTags as any[],
			) as MetaTag[],
			additionalLinkTags: mergeArray(
				additionalLinkTags as any[],
				$defaultAdditionalLinkTags as any[],
			) as LinkTag[],
		}) ?? [];

	onMount(() => {
		if (id !== 0) {
			const oldTags = document.querySelectorAll(`[data-dr-head]`);
			const newTags = document.querySelectorAll(`[data-dr-head="${id}"]`);
			const newTagsArray = Array.from(newTags);
			oldTags.forEach((oldTag) => {
				if (!newTagsArray.includes(oldTag)) {
					oldTag.remove();
				}
			});
		}
	});
</script>

<svelte:head>
	{#each tags as tagObj (tagObj.key)}
		{@const { tag, key, slot, ...props } = tagObj}
		{#if slot}
			<svelte:element this={tag} {...props} data-dr-head={id}>
				{slot}
			</svelte:element>
		{:else}
			<svelte:element this={tag} {...props} data-dr-head={id} />
		{/if}
	{/each}
</svelte:head>
