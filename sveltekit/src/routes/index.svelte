<svelte:head>
	<title>David Portfolio</title>
</svelte:head>

<script lang="ts">
    import { ExternalLink, ExternalLinkTypes } from "$lib/components/ExternalLink";
</script>

<h1>Welcome to SvelteKit</h1>
<p class="bg-mauve-11">Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<ExternalLink type={ExternalLinkTypes.underline} href="https://hallo.com">HALLO WORLD</ExternalLink>
