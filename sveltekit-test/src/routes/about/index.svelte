<script lang="ts">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;

	import { Headline } from '$components/Headline';

	import me from '$assets/me/serious.png?w=752;496&format=webp;png&meta';
	import smile from '$assets/me/smile.png?w=752;496;&format=webp;png&meta';

	const sizes = '(min-width: 768px) 752px, 496px';

	import { Image } from '$lib/Primitives/Image';
</script>

<div
	class="flex flex-col-reverse border-b sm:flex-row sm:justify-between border-mauve-6"
>
	<Headline containerClass="py-8 border-b-0 md:py-16">This is me</Headline>
	<div
		class="flex overflow-hidden max-w-[249px] sm:max-w-[250px] md:max-w-[378px]"
	>
		<Image
			width={248}
			height={248}
			meta={me}
			{sizes}
			alt="me"
			imgClass=""
			class="border-r sm:border-l border-mauve-6"
		/>
		<Image
			width={248}
			height={248}
			meta={smile}
			{sizes}
			alt="happy me"
			imgClass=""
			class=""
		/>
	</div>
</div>
<Headline as="h2" type="secondary" containerClass="bg-white/[0.85]"
	>Frontend Developer, UI/UX Designer</Headline
>

<section
	class="mb-8 border-b first:border-t-0 border-mauve-6 md:mb-16 last:mb-0"
>
	<h1>About this app</h1>

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
		The <a sveltekit:prefetch href="/about/music">Music</a>
		page illustrates SvelteKit's data loading and form handling. Try using it
		with JavaScript disabled!
	</p>
</section>
