<script lang="ts">
	let c = '';
	export { c as class };

	import { TransparentSection } from '$lib/Components/TransparentSection';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import Logo from '$lib/Components/Logo/Logo.svelte';
	import { NavLink } from '$lib/Components/NavLink';
	import * as VisuallyHidden from '$primitives/VisuallyHidden';
</script>

<TransparentSection class={`fixed top-0 w-full ${c}`}>
	<nav class="xl:container">
		<h3><VisuallyHidden.Root>Main Menu</VisuallyHidden.Root></h3>
		<ul role="menubar" class="flex justify-between">
			<li role="menuitem" class="w-auto list-none">
				<NavLink href="/" type="icon">
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
							class="bg-white hover:bg-purple-5"
							activeClass="!bg-purple-5">Projects</NavLink
						>
					</li>
					<li role="menuitem" class="list-none">
						<NavLink
							href="/about"
							activePath="/about"
							class="bg-white hover:bg-purple-5"
							activeClass="!bg-purple-5">About</NavLink
						>
					</li>
					<li role="menuitem" class="list-none">
						<NavLink
							href="/contact"
							type="button"
							activePath="/contact"
							class="bg-white hover:bg-purple-5"
							activeClass="!bg-purple-5">Say hi!</NavLink
						>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
</TransparentSection>
