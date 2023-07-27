<script lang="ts">
	import type { PageData } from './$types';
	import { Headline } from '$components/Headline';

	console.info('_prerender: +page.svelte');

	export let data: PageData;
</script>

<section class="mb-32">
	<Headline as="h2" containerClass="py-8 md:py-16">Prerender</Headline>

	<Headline as="h3" type="secondary">Projects</Headline>
	{#each data.projectLinks as projectLink}
		<!-- content here -->
		<p>
			<a class="underline focus:outline-none" href={projectLink}>
				{projectLink}
			</a>
		</p>
	{/each}
</section>
