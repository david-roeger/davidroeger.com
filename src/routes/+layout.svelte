<script lang="ts">
	logger.page('index: +layout.svelte');
	// ----------------------------------------------------------------

	import '../app.css';
	import '../fonts.css';

	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { mauve, mauveDark } from '@radix-ui/colors';

	import { page } from '$app/stores';

	import { BreakpointProvider } from '$provider/BreakpointProvider';
	import { NotificationProvider } from '$provider/NotificationProvider';

	import { Header } from '$slices/Header';
	import { Footer } from '$slices/Footer';

	import { DefaultHead } from '$components/Head';

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

<div class="contents font-sans">
	<QueryClientProvider client={data.queryClient}>
		<NotificationProvider>
			<MiniPlayerProvider>
				<div
					class="bg-blue relative flex min-h-full flex-col text-mauve-12"
					data-sveltekit-preload-data
				>
					<a
						href="#content"
						class="absolute -top-full left-2 z-50 border bg-white px-4 py-2 ring-mauve-12 focus:top-2 focus:outline-none focus:ring-1"
					>
						Skip to content
					</a>
					<Header class="z-40" />

					<main
						id="content"
						class="z-10 mb-auto flex flex-col border-mauve-6 xl:max-w-7xl xl:border-r"
					>
						<BreakpointProvider>
							<slot />
						</BreakpointProvider>
					</main>

					<Footer class="z-20" />
				</div>

				<div id="portal" style="position: absolute; z-index: 9999" />
			</MiniPlayerProvider>
		</NotificationProvider>
		<SvelteQueryDevtools buttonPosition="bottom-right" />
	</QueryClientProvider>
</div>
