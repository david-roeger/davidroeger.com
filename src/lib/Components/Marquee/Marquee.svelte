<script lang="ts">
	import AccessibleIcon from '$lib/Components/AccessibleIcon/AccessibleIcon.svelte';
	import Close16 from '$assets/Icons/24/close.svg?component';
	import { slide } from 'svelte/transition';

	let c = '';
	export { c as class };

	export let wrapperClass = '';

	export let href: string | undefined = undefined;
	export let count = 15;
	export let close = true;

	let show = true;

	const tag = href ? 'a' : 'span';
</script>

{#if show}
	<div class="flex mr-0 border-b border-mauve-6 h-[41px] {c}">
		<div class="flex-1 relative">
			<div
				class="absolute left-0 right-0 overflow-hidden flex items-center justify-center"
			>
				<div class="w-fit-content flex will-change-transform">
					<svelte:element
						this={tag}
						{href}
						class="w-fit-content flex will-change-transform {tag ===
						'a'
							? 'hover:underline'
							: ''} c"
					>
						<span class={wrapperClass}>
							<slot />
						</span>
						{#each { length: count } as _, i}
							<span aria-hidden="true" class={wrapperClass}>
								<slot />
							</span>
						{/each}
					</svelte:element>
				</div>
			</div>
		</div>
		{#if close}
			<div class="border-l border-mauve-6">
				<button
					on:click={() => {
						show = false;
					}}
					class="p-1 m-1 text-xs border rounded-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
				>
					<AccessibleIcon label="Hide Marquee">
						<Close16 />
					</AccessibleIcon>
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	@media (prefers-reduced-motion: no-preference) {
		.c {
			animation: scroll 120s linear infinite;
		}

		.c:hover {
			animation-play-state: paused;
		}
	}

	@keyframes scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-100%);
		}
	}
</style>
