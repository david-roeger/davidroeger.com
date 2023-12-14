<script lang="ts">
	logger.page('error: +error.svelte');
	// ----------------------------------------------------------------
	import { page } from '$app/stores';
	import East from '$assets/Icons/24/east.svg?component';
	import { Background } from '$components/Background';
	import { red, redDark } from '@radix-ui/colors';
	import { Head } from '$components/Head';
	import { Headline } from '$components/Headline';
	import { NavLink } from '$components/NavLink';

	import { logger } from '$utils/logger';

	$: error = $page.error?.message ?? '';
	$: status = $page.status;
</script>

<Head
	title={` | ${error} (${status})`}
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: red.red3,
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: redDark.red3,
			media: '(prefers-color-scheme: dark)'
		}
	]}
	noindex
	nofollow
/>

<Background
	center="hsl(var(--drds-red-5) / 0.4)"
	outside="hsl(var(--drds-red-5) / 0)"
/>

<section class="relative">
	<p class="border-b border-mauve-6 p-2 text-sm text-mauve-11">
		{status}: {error}
	</p>
	<Headline containerClass="py-8 md:py-16">{status}</Headline>

	<h2 class="border-b border-mauve-6 p-2 text-xl">
		<p>Welp. This didn´t work. Sorry Aboot It!</p>
	</h2>

	<p class="border-b border-mauve-6 bg-white p-2">
		I don't know how you ended up here but you probably wanted do one of the
		following:
	</p>
	<div class="mb-32 border-b border-mauve-6 bg-white/[0.85] p-1">
		<ol class="flex flex-col">
			<li class="m-1 flex-grow list-none">
				<NavLink
					role="menuitem"
					href="/projects"
					variant="green"
					class="flex items-center justify-between gap-2 bg-white pl-2 !transition-[gap,padding,color,background-color] hover:gap-4 hover:bg-green-4 hover:pr-2 focus:gap-4 focus:pr-2"
				>
					<span>
						<span class="mr-1 rounded-full bg-white p-1 px-[6px]">
							🥽
						</span>
						Look at some stuff I worked on
					</span>
					<span aria-hidden="true">
						<East />
					</span>
				</NavLink>
			</li>
			<li class="m-1 flex-grow list-none">
				<NavLink
					role="menuitem"
					href="/about"
					class="flex items-center justify-between gap-2 bg-white pl-2 !transition-[gap,padding,color,background-color] hover:gap-4 hover:bg-purple-4 hover:pr-2 focus:gap-4 focus:pr-2"
					variant="purple"
				>
					<span>
						<span class="mr-1 rounded-full bg-white p-1 px-[6px]">
							🌈
						</span>
						Learn something about me
					</span>
					<span aria-hidden="true">
						<East />
					</span>
				</NavLink>
			</li>
			<li class="m-1 flex-grow list-none">
				<NavLink
					role="menuitem"
					href="/contact"
					class="flex items-center justify-between gap-2 bg-white pl-2 !transition-[gap,padding,color,background-color] hover:gap-4 hover:bg-orange-4 hover:pr-2 focus:gap-4 focus:pr-2"
					variant="orange"
				>
					<span>
						<span class="mr-1 rounded-full bg-white p-1 px-[6px]">
							🌞
						</span>
						Just say hi
					</span>
					<span aria-hidden="true">
						<East />
					</span>
				</NavLink>
			</li>
		</ol>
	</div>
</section>
