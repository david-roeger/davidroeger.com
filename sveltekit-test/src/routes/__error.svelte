<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				error,
				status
			}
		};
	}
</script>

<script lang="ts">
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import NavLink from '$lib/Components/NavLink/NavLink.svelte';
	import East from '$assets/Icons/24/east.svg';

	export let error: any;
	export let status: any;
</script>

<svelte:head>
	<title>DR | {error.name} ({status})</title>
</svelte:head>

<div
	class="fixed top-0 bottom-0 w-full h-full xl:container -z-10"
	style="background: radial-gradient(50% 50% at 50% 50%, hsl(359, 74.2%, 81.7%, 0.4) 0%, hsl(359, 74.2%, 81.7%, 0) 100%);"
/>

<Headline class="pt-8 md:pt-16"><p>{status}</p></Headline>
<p class="p-2 text-sm border-b text-mauve-11 border-mauve-6">
	{error.name}: {error.message}
</p>
<h2 class="p-2 mb-8 text-xl md:mb-16">
	<p>Welp. This didn´t work.</p>
	<p>Sorry Aboot It!</p>
</h2>

<p class="p-2 bg-white border-t border-b border-mauve-6">
	I don't know how you ended up here but you probably wanted do one of the following:
</p>
<div class="p-1 border-b border-mauve-6">
	<ol class="flex flex-col">
		<li class="flex-grow m-1 list-none">
			<NavLink
				role="menuitem"
				href="/projects"
				class="pl-2 bg-white hover:bg-green-5 flex items-center justify-between gap-2  transition-[gap,padding] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2"
				activeClass="!bg-green-5"
			>
				<span
					><span class="p-1 m-1 bg-white rounded-full">👁</span>Look at some stuff I worked on
				</span>
				<East />
			</NavLink>
		</li>
		<li class="flex-grow m-1 list-none">
			<NavLink
				role="menuitem"
				href="/about"
				class="pl-2 bg-white hover:bg-purple-5 flex items-center justify-between gap-2  transition-[gap,padding] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2"
				activeClass="!bg-purple-5"
			>
				<span><span class="p-1 m-1 bg-white rounded-full">📚</span>Learn something about me</span>
				<East />
			</NavLink>
		</li>
		<li class="flex-grow m-1 list-none">
			<NavLink
				role="menuitem"
				href="/contact"
				class="pl-2 bg-white hover:bg-blue-5 flex items-center justify-between gap-2  transition-[gap,padding] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2"
				activeClass="!bg-purple-5"
			>
				<span><span class="p-1 m-1 bg-white rounded-full">👋</span>Just say hi</span>
				<East />
			</NavLink>
		</li>
	</ol>
</div>
