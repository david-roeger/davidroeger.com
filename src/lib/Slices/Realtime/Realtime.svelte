<script lang="ts">
	import { onMount } from 'svelte';
	import {
		REALTIME_COOKIE_NAME,
		subscribe,
		type CursorType
	} from './constants';
	import { v4 as uuid } from 'uuid';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { type RealtimePresenceState } from '@supabase/supabase-js';
	import Cursor from './Cursor.svelte';
	import { fade } from 'svelte/transition';

	let trackCursor: (c: CursorType) => void = () => {};

	let id = '';
	let state = writable<RealtimePresenceState<CursorType>>({});
	let own = writable<CursorType>({
		id,
		type: 'cursor',
		path: $page.url.pathname,
		color: 'green',
		x: -1,
		y: -1
	});

	onMount(() => {
		const realTimeCookie = document.cookie
			.split('; ')
			.find((row) => row.startsWith(REALTIME_COOKIE_NAME));
		if (!realTimeCookie) {
			id = uuid();
			document.cookie = `${REALTIME_COOKIE_NAME}=${id}; path=/`;
		} else {
			id = realTimeCookie.split('=')[1];
		}

		const a = subscribe({
			onSync: (data) => {
				const newData = { ...data };
				delete newData[id];
				state.set(newData);
			},
			initalState: {
				id,
				type: 'mount',
				path: $page.url.pathname,
				color: 'green',
				x: -1,
				y: -1
			}
		});

		trackCursor = a.trackCursor;
		return a.unsubscribe;
	});

	let handleMouseMove = (e: MouseEvent) => {
		$own = {
			id,
			type: 'cursor',
			path: $page.url.pathname,
			color: 'green',
			x: e.clientX,
			y: e.clientY
		};

		trackCursor({
			id,
			type: 'cursor',
			path: $page.url.pathname,
			color: 'green',
			x: e.clientX,
			y: e.clientY
		});
	};

	const handlePathname = (pathname: string) => {
		const current = $own;
		$own = { ...current, path: pathname };
		trackCursor({ ...current, path: pathname });
	};

	$: handlePathname($page.url.pathname);
</script>

<svelte:window on:mousemove={handleMouseMove} />

<slot />

<div class="pointer-events-none fixed inset-0 overflow-hidden">
	{#each Object.values($state).filter((_, i) => i < 9) as s}
		{@const c = s[0]}
		{#if c.path === $page.url.pathname && c.x !== -1 && c.y !== -1}
			<!-- {#key `${c.id}-${c.path}`} -->
			<div transition:fade={{ duration: 1000 }}>
				<Cursor type="tween" x={c.x} y={c.y} />
			</div>
		{/if}
	{/each}

	{#if $own.x !== -1 && $own.y !== -1}
		<div transition:fade={{ duration: 1000 }}>
			<Cursor type="spring" x={$own.x} y={$own.y} />
		</div>
	{/if}
</div>
