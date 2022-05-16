<script context="module" lang="ts">
	/** @type {import('@sveltejs/kit').Load} */
	export function load({ error, status }) {
		return {
			props: {
				error,
				status,
			},
		};
	}
</script>

<script lang="ts">
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import NavLink from '$lib/Components/NavLink/NavLink.svelte';
	import East from '$assets/Icons/24/east.svg';
	import { Background } from '$components/Background';
	import Head from '$lib/Components/Head/Head.svelte';
	import DefaultHead from '$lib/Components/Head/DefaultHead.svelte';

	export let error: any;
	export let status: any;
</script>

<Head title={` | ${error.name} (${status})`} noindex nofollow />

<Background
	center="hsla(359, 74%, 82%, 0.4)"
	outside="hsla(359, 74%, 82%, 0)"
/>

<section class="relative">
	<p class="p-2 text-sm border-b text-mauve-11 border-mauve-6">
		{error.name}: {error.message}
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
					class="pl-2 bg-white hover:bg-green-5 flex items-center justify-between gap-2  transition-[gap,padding] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2"
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
					class="pl-2 bg-white hover:bg-purple-5 flex items-center justify-between gap-2  transition-[gap,padding] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2"
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
					class="pl-2 bg-white hover:bg-orange-5 flex items-center justify-between gap-2  transition-[gap,padding] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2"
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
