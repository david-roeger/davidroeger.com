<script lang="ts">
	logger.page('index: +layout.svelte');
	// ----------------------------------------------------------------

	import '../app.css';

	import { onMount } from 'svelte';
	import BezierEasing from 'bezier-easing';

	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { mauve, mauveDark } from '@radix-ui/colors';

	import { page } from '$app/stores';

	import { BreakpointProvider } from '$provider/BreakpointProvider';
	import { NotificationProvider } from '$provider/NotificationProvider';

	import North from '$assets/Icons/24/north.svg?component';

	import { Header } from '$slices/Header';
	import { Footer } from '$slices/Footer';
	import { HireMe } from '$slices/HireMe';

	import { AccessibleIcon } from '$components/AccessibleIcon';
	import { DefaultHead } from '$components/Head';

	import { mapToRange } from '$utils';
	import { logger } from '$utils/logger';

	import type { LayoutData } from './$types';
	import MiniPlayerProvider from '$provider/MiniPlayerProvider/MiniPlayerProvider.svelte';

	export let data: LayoutData;

	const getTitle = (path: string) => {
		const pathArray = path.split('/').filter((item) => item !== '');

		let finalPath = '';
		pathArray.forEach((item) => {
			finalPath =
				finalPath +
				` | ${item.charAt(0).toUpperCase()}${item.slice(1)}`;
		});
		return finalPath;
	};
	// bttbutton handling
	let showBttButton = false;
	const handleScroll = () => {
		if (
			(document.body.scrollTop > 120 ||
				document.documentElement.scrollTop > 120) &&
			document.body.offsetHeight > window.innerHeight
		) {
			showBttButton = true;
			return;
		}
		showBttButton = false;
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
	});

	const handleClick = (
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
		event.currentTarget.blur();
	};

	const baseEasing = BezierEasing(0.4, 0, 0.2, 1);
	const reversedEasing = BezierEasing(0.8, 0, 0.6, 1);

	function slideUp(
		_: HTMLDivElement,
		{ start = -42, end = 0, duration = 150, easing = baseEasing }
	) {
		return {
			duration,
			css: (t: number) => {
				const eased = easing(t);
				const mapped = mapToRange(eased, 0, 1, start, end);
				return `bottom: ${mapped}px;`;
			}
		};
	}
</script>

<DefaultHead
	noindex
	nofollow
	titleTemplate="DR %s"
	title={getTitle($page.url.pathname)}
	canonical={`https://www.davidroeger.com${$page.url.pathname.split('?')[0]}`}
	description="David Roeger Web Developer and Designer based in Stuttgart, Germany."
	openGraph={{
		type: 'website',
		site_name: 'David Roeger',
		locale: 'en',
		url: `https://www.davidroeger.com${$page.url.pathname.split('?')[0]}`,
		images: [
			{
				url: 'https://www.davidroeger.com/meta/og_image.jpg',
				width: 1200,
				height: 1200,
				alt: 'Antique greece statue',
				type: 'image/jpeg'
			}
		]
	}}
	additionalLinkTags={[
		// apple touch
		{
			rel: 'apple-touch-icon',
			sizes: '57x57',
			href: '/meta/apple-touch-icon-57x57.png'
		},
		{
			rel: 'apple-touch-icon',
			sizes: '60x60',
			href: '/meta/apple-touch-icon-60x60.png'
		},
		{
			rel: 'apple-touch-icon',
			sizes: '72x72',
			href: '/meta/apple-touch-icon-72x72.png'
		},
		{
			rel: 'apple-touch-icon',
			sizes: '76x76',
			href: '/meta/apple-touch-icon-76x76.png'
		},
		{
			rel: 'apple-touch-icon',
			sizes: '114x114',
			href: '/meta/apple-touch-icon-114x114.png'
		},
		{
			rel: 'apple-touch-icon',
			sizes: '120x120',
			href: '/meta/apple-touch-icon-120x120.png'
		},
		{
			rel: 'apple-touch-icon',
			sizes: '144x144',
			href: '/meta/apple-touch-icon-144x144.png'
		},
		{
			rel: 'apple-touch-icon',
			sizes: '152x152',
			href: '/meta/apple-touch-icon-152x152.png'
		},
		{
			rel: 'apple-touch-icon',
			sizes: '167x167',
			href: '/meta/apple-touch-icon-167x167.png'
		},
		{
			rel: 'apple-touch-icon',
			sizes: '180x180',
			href: '/meta/apple-touch-icon-180x180.png'
		},
		// favicon
		{
			rel: 'icon',
			type: 'image/svg+xml',
			sizes: 'any',
			href: '/meta/favicon-32x32.svg'
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '16x16',
			href: '/meta/favicon-16x16.png'
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '32x32',
			href: '/meta/favicon-32x32.png'
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '96x96',
			href: '/meta/favicon-96x96.png'
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '128x128',
			href: '/meta/favicon-128x128.png'
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '196x196',
			href: '/meta/favicon-196x196.png'
		},

		// maskable icon
		{
			rel: 'mask-icon',
			href: '/meta/safari-pinned-tab.svg',
			// purple-9
			color: '#8E4EC6'
		},

		// manifest
		{
			rel: 'manifest',
			href: '/manifest.webmanifest'
		}
	]}
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: mauve.mauve3,
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: mauveDark.mauve3,
			media: '(prefers-color-scheme: dark)'
		},
		{
			name: 'msapplication-config',
			content: '/meta/browserconfig.xml'
		},
		{
			name: 'keywords',
			content:
				'David Roeger, Web Development, UX Design, aesthetics, brutalistic, visual, Stuttgart, Germany, 0711'
		}
	]}
/>

<QueryClientProvider client={data.queryClient}>
	<NotificationProvider>
		<MiniPlayerProvider>
			<div
				class="relative flex flex-col min-h-full font-sans text-mauve-12 bg-blu"
				data-sveltekit-preload-data
			>
				<a
					href="#content"
					class="absolute z-50 px-4 py-2 bg-white border -top-full left-2 focus:top-2 focus:outline-none ring-mauve-12 focus:ring-1"
				>
					Skip to content
				</a>
				<Header class="z-40" />

				<main
					id="content"
					class="z-10 flex flex-col mb-auto xl:max-w-7xl xl:border-r border-mauve-6"
				>
					<BreakpointProvider>
						<slot />
					</BreakpointProvider>
				</main>

				<Footer class="z-20" />

				{#if showBttButton}
					<div
						class="sticky bottom-0 left-0 z-30 p-2 overflow-hidden pointer-events-none"
						in:slideUp={{}}
						out:slideUp={{ easing: reversedEasing }}
					>
						<button
							aria-hidden={!showBttButton ? true : undefined}
							tabindex={showBttButton ? 0 : -1}
							on:click={handleClick}
							on:click
							type="button"
							class="{showBttButton
								? 'pointer-events-auto'
								: 'translate-y-[42px] pointer-events-none'} block p-1 text-xs transition-transform bg-white border rounded-full cursor-n-resize touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
						>
							<AccessibleIcon label="Back to top">
								<North />
							</AccessibleIcon>
						</button>
					</div>
				{/if}
			</div>

			<div id="portal" style="position: absolute; z-index: 9999" />
		</MiniPlayerProvider>
	</NotificationProvider>
	<SvelteQueryDevtools buttonPosition="bottom-right" />
</QueryClientProvider>
