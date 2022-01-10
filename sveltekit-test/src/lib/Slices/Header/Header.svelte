<script lang="ts">
	let c = '';
	export { c as class };

	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import Logo from '$lib/Components/Logo/Logo.svelte';
	import { NavLink } from '$lib/Components/NavLink';
	import * as VisuallyHidden from '$primitives/VisuallyHidden';
	import { TransparentSection } from '$lib/Components/TransparentSection';

	import { page } from '$app/stores';
</script>

<TransparentSection class={`w-full ${c}`}>
	<nav class="xl:container">
		<h3><VisuallyHidden.Root>Main Menu</VisuallyHidden.Root></h3>
		<ul class="flex justify-between">
			<li class="w-auto m-2 list-none">
				<NavLink class="block" href="/" type="icon" role="link">
					<slot name="logo">
						<AccessibleIcon label="David Roeger Logo - Go to Main Page"
							><Logo
								animated={true}
								sad={$page.error ? true : false}
								class="w-auto h-full"
							/></AccessibleIcon
						>
					</slot>
				</NavLink>
			</li>
			<li>
				<ul role="menubar" class="flex flex-wrap justify-end m-1">
					<li role="none" class="m-1 list-none">
						<NavLink
							role="menuitem"
							href="/projects"
							activePath="/projects"
							activeRegEx={/^\/projects\/[^\/]+$/}
							class="block bg-white hover:bg-green-5"
							activeClass="!bg-green-5">Projects</NavLink
						>
					</li>
					<li role="none" class="m-1 list-none">
						<NavLink
							role="menuitem"
							href="/about/music"
							activePath="/about"
							activeRegEx={/^\/about\/[^\/]+$/}
							class="block bg-white hover:bg-purple-5"
							activeClass="!bg-purple-5">About</NavLink
						>
					</li>
					<li role="none" class="m-1 list-none">
						<NavLink
							role="menuitem"
							href="/contact"
							type="button"
							activePath="/contact"
							class="block bg-white hover:bg-purple-5"
							activeClass="!bg-purple-5">Say hi!</NavLink
						>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
</TransparentSection>
