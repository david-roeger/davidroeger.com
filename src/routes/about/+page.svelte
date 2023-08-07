<script lang="ts">
	logger.page('about: +page.svelte');
	// ----------------------------------------------------------------

	import { Headline } from '$components/Headline';

	import { logger } from '$utils';

	import type { PageData } from './$types';

	export let data: PageData;

	$: resume = data.resume;
</script>

<div
	class="flex flex-col-reverse border-b sm:flex-row sm:justify-between border-mauve-6"
>
	<Headline containerClass="py-8 border-b-0 md:py-16">
		<span aria-hidden="true" class="select-none">::</span>
		Me
	</Headline>
	<div
		class="overflow-hidden max-w-[249px] sm:max-w-[250px] md:max-w-[378px]"
	/>
</div>
<Headline as="h2" type="secondary" containerClass="bg-white/[0.85]">
	{resume.basics?.label}
</Headline>

<section class="mb-32">
	<p>
		This is a <a href="https://kit.svelte.dev">SvelteKit</a>
		app. You can make your own by typing the following into your command line
		and following the prompts:
	</p>

	<!-- TODO lose the @next! -->
	<pre>npm init svelte@next</pre>

	<p>
		The page you're looking at is purely static HTML, with no client-side
		interactivity needed. Because of that, we don't need to load any
		JavaScript. Try viewing the page's source, or opening the devtools
		network panel and reloading.
	</p>

	<p>
		The <a href="/about/music">Music</a>
		page illustrates SvelteKit's data loading and form handling. Try using it
		with JavaScript disabled!
	</p>
</section>
