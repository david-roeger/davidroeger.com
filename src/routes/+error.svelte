<script lang="ts">
	logger.page('error: +error.svelte');
	// ----------------------------------------------------------------

	import { page } from '$app/stores';

	import { Headline } from '$components/Headline';
	import { NavLink } from '$components/NavLink';
	import { Background } from '$components/Background';
	import { Head } from '$components/Head';

	import East from '$assets/Icons/24/east.svg?component';

	import { logger } from '$utils/logger';

	$: error = $page.error?.message ?? '';
	$: status = $page.status;
</script>

<Head
	title={` | ${error} (${status})`}
	additionalMetaTags={[
		{
			name: 'theme-color',
			// red-3
			content: '#FFEFEF',
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: '#3C181A',
			media: '(prefers-color-scheme: dark)'
		}
	]}
	noindex
	nofollow
/>

<Background
	center="hsla(359, 74%, 82%, 0.4)"
	outside="hsla(359, 74%, 82%, 0)"
/>

<section class="relative">
	<p class="p-2 text-sm border-b text-mauve-11 border-mauve-6">
		{status}: {error}
	</p>
	<Headline containerClass="py-8 md:py-16">{status}</Headline>

	<h2 class="p-2 text-xl border-b border-mauve-6">
		<p>Welp. This didn´t work. Sorry Aboot It!</p>
	</h2>

	<p class="p-2 bg-white border-b border-mauve-6">
		I don't know how you ended up here but you probably wanted do one of the
		following:
	</p>
	<div class="p-1 mb-32 border-b border-mauve-6 bg-white/[0.85]">
		<ol class="flex flex-col">
			<li class="flex-grow m-1 list-none">
				<NavLink
					role="menuitem"
					href="/projects"
					class="pl-2 bg-white hover:bg-green-5 flex items-center justify-between gap-2 !transition-[gap,padding,color,background-color] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2"
					activeClass="!bg-green-5"
				>
					<span>
						<span class="p-1 px-[6px] mr-1 bg-white rounded-full">
							🥽
						</span>
						Look at some stuff I worked on
					</span>
					<span aria-hidden="true">
						<East />
					</span>
				</NavLink>
			</li>
			<li class="flex-grow m-1 list-none">
				<NavLink
					role="menuitem"
					href="/about"
					class="pl-2 bg-white hover:bg-purple-5 flex items-center justify-between gap-2 !transition-[gap,padding,color,background-color] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2"
					activeClass="!bg-purple-5"
				>
					<span>
						<span class="p-1 px-[6px] mr-1 bg-white rounded-full">
							🌈
						</span>
						Learn something about me
					</span>
					<span aria-hidden="true">
						<East />
					</span>
				</NavLink>
			</li>
			<li class="flex-grow m-1 list-none">
				<NavLink
					role="menuitem"
					href="/contact"
					class="pl-2 bg-white hover:bg-orange-5 flex items-center justify-between gap-2 !transition-[gap,padding,color,background-color] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2"
					activeClass="!bg-orange-5"
				>
					<span>
						<span class="p-1 px-[6px] mr-1 bg-white rounded-full">
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
