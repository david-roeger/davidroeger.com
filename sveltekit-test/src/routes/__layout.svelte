<script lang="ts">
	import '../app.css';
	import { BreakpointProvider } from '$lib/Provider/Breakpoint';
	import { Header } from '$lib/Slices/Header';
	import { BttButton } from '$lib/Components/BttButton';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import North from '$assets/Icons/24/north.svg';

	import { page } from '$app/stores';
	import DefaultHead from '$lib/Components/Head/DefaultHead.svelte';

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

	import { session } from '$app/stores';
	import { supabaseClient } from '$lib/Utils/Supabase/supabaseClient';
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte';
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
				type: 'image/jpeg',
			},
		],
	}}
	additionalLinkTags={[
		// apple touch
		{
			rel: 'apple-touch-icon',
			sizes: '57x57',
			href: '/meta/apple-touch-icon-57x57.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '60x60',
			href: '/meta/apple-touch-icon-60x60.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '72x72',
			href: '/meta/apple-touch-icon-72x72.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '76x76',
			href: '/meta/apple-touch-icon-76x76.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '114x114',
			href: '/meta/apple-touch-icon-114x114.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '120x120',
			href: '/meta/apple-touch-icon-120x120.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '144x144',
			href: '/meta/apple-touch-icon-144x144.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '152x152',
			href: '/meta/apple-touch-icon-152x152.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '167x167',
			href: '/meta/apple-touch-icon-167x167.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '180x180',
			href: '/meta/apple-touch-icon-180x180.png',
		},
		// favicon
		{
			rel: 'icon',
			type: 'image/svg+xml',
			sizes: 'any',
			href: '/meta/favicon-32x32.svg',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '16x16',
			href: '/meta/favicon-16x16.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '32x32',
			href: '/meta/favicon-32x32.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '96x96',
			href: '/meta/favicon-96x96.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '128x128',
			href: '/meta/favicon-128x128.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '196x196',
			href: '/meta/favicon-196x196.png',
		},

		// maskable icon
		{
			rel: 'mask-icon',
			href: '/meta/safari-pinned-tab.svg',
			color: '#E4E4E2',
		},
	]}
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: '#E4E4E2',
		},
		{
			name: 'msapplication-config',
			content: '/meta/browserconfig.xml',
		},
		{
			name: 'keywords',
			content:
				'David Roeger, Web Development, UX Design, aesthetics, brutalistic, visual, Stuttgart, Germany, 0711',
		},
	]}
/>

<SupaAuthHelper {supabaseClient} {session}>
	<div class="font-sans text-mauve-12">
		<Header class="z-30" />
		<main class="z-10 xl:max-w-7xl xl:border-r border-mauve-6">
			<BreakpointProvider>
				<slot />
			</BreakpointProvider>
		</main>

		<BttButton>
			<AccessibleIcon label="Back to top"><North /></AccessibleIcon>
		</BttButton>
		<!--footer class="z-20 " /-->
	</div>
</SupaAuthHelper>
