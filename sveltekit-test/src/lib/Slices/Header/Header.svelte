<script lang="ts">
	import { page } from '$app/stores';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import Logo from '$lib/Components/Logo/Logo.svelte';
	import { NavLink } from '$lib/Components/NavLink';
	import * as VisuallyHidden from '$primitives/VisuallyHidden';
</script>

<header class="sticky top-0 border-b bg-white/60 backdrop-blur-xl">
	<nav class="xl:container">
		<h3><VisuallyHidden.Root>Main Menu</VisuallyHidden.Root></h3>
		<ul role="menubar" class="flex justify-between">
			<li role="menuitem" class="w-auto list-none">
				<NavLink href="/" type="icon" class="bg-white">
					<slot name="logo">
						<AccessibleIcon label="David Roeger Logo - Link to Main Page"
							><Logo animated={true} class="w-auto h-full" /></AccessibleIcon
						>
					</slot>
				</NavLink>
			</li>
			<li>
				<ul class="flex flex-wrap justify-end">
					<li role="menuitem" class="list-none">
						<NavLink
							href="/projects"
							activePath="/projects"
							activeRegEx={/^\/projects\/[^\/]+$/}
							class="bg-white hover:bg-blue-5"
							activeClass="!bg-blue-5">Projects</NavLink
						>
					</li>
					<li role="menuitem" class="list-none">
						<NavLink
							href="/about"
							activePath="/about"
							class="bg-white hover:bg-orange-5"
							activeClass="!bg-orange-5">About</NavLink
						>
					</li>
					<li role="menuitem" class="list-none">
						<NavLink
							href="/contact"
							type="button"
							activePath="/contact"
							class="bg-white hover:bg-plum-5"
							activeClass="!bg-plum-5">Say hi!</NavLink
						>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
</header>
