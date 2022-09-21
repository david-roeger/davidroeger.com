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
		LinkTag
	} from './types';
	import { defaultSeoProps } from './store';
	import buildTags from './utils';
	import { onMount } from 'svelte';

	export let title: string | undefined = undefined;
	export let noindex: boolean | undefined = undefined;
	export let nofollow: boolean | undefined = undefined;
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
		additionalLinkTags: defaultAdditionalLinkTags
	} = defaultSeoProps;

	function mergeObject<T extends Record<string, unknown> | undefined>(
		value: T,
		defaultValue: T
	): T | undefined {
		if (
			(value === undefined || Object.keys(value).length === 0) &&
			(defaultValue === undefined ||
				Object.keys(defaultValue).length === 0)
		) {
			return undefined;
		}

		const mergedObject = {
			...defaultValue,
			...value
		};

		return mergedObject as T;
	}

	function serialize<T>(array: T[] = []) {
		return array.map((value) => JSON.stringify(value));
	}

	function mergeArray<T>(
		values: T[] = [],
		defaultValues: T[] = []
	): T[] | undefined {
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
	}

	const mergeAdditionalMetaTags = (
		values: Readonly<MetaTag[]> = [],
		defaultValues: Readonly<MetaTag[]> = []
	) => {
		const serializedValues = serialize(
			values.map((value) => ({ ...value, content: undefined }))
		);
		const serializedDefaultValues = serialize(
			defaultValues.map((defaultValue) => ({
				...defaultValue,
				content: undefined
			}))
		);

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

	const mergeAdditionalLinkTags = (
		values: Readonly<LinkTag[]> = [],
		defaultValues: Readonly<LinkTag[]> = []
	) => {
		const serializedValues = serialize(
			values.map((value) => ({ ...value, href: undefined }))
		);
		const serializedDefaultValues = serialize(
			defaultValues.map((defaultValue) => ({
				...defaultValue,
				href: undefined
			}))
		);

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
				$defaultMobileAlternate
			),
			languageAlternates: mergeArray(
				languageAlternates,
				$defaultLanguageAlternates
			),
			openGraph: mergeObject(openGraph, $defaultOpenGraph) as OpenGraph,
			facebook: mergeObject(facebook, $defaultFacebook) as {
				appId: string;
			},
			twitter: mergeObject(twitter, $defaultTwitter) as Twitter,
			additionalMetaTags: mergeAdditionalMetaTags(
				additionalMetaTags,
				$defaultAdditionalMetaTags
			),
			additionalLinkTags: mergeAdditionalLinkTags(
				additionalLinkTags,
				$defaultAdditionalLinkTags
			)
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
	{#each tags as tagObj (`${tagObj.tag}-${tagObj.key}`)}
		{@const { tag, slot, key, ...props } = tagObj}
		{#if slot}
			<svelte:element this={tag} {...props} data-dr-head={id}>
				{slot}
			</svelte:element>
		{:else}
			<svelte:element this={tag} {...props} data-dr-head={id} />
		{/if}
	{/each}
</svelte:head>
