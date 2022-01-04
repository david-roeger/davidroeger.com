<script lang="ts">
	let c = '';
	export { c as class };

	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import Logo from '$lib/Components/Logo/Logo.svelte';
	import { NavLink } from '$lib/Components/NavLink';
	import * as VisuallyHidden from '$primitives/VisuallyHidden';
	import { TransparentSection } from '$lib/Components/TransparentSection';
</script>

<TransparentSection class={`w-full fixed top-0 ${c}`}>
	<nav class="xl:container">
		<h3><VisuallyHidden.Root>Main Menu</VisuallyHidden.Root></h3>
		<ul class="flex justify-between">
			<li class="w-auto list-none">
				<NavLink href="/" type="icon" role="link">
					<slot name="logo">
						<AccessibleIcon label="David Roeger Logo - Go to Main Page"
							><Logo animated={true} class="w-auto h-full" /></AccessibleIcon
						>
					</slot>
				</NavLink>
			</li>
			<li>
				<ul role="menubar" class="flex flex-wrap justify-end">
					<li role="none" class="list-none">
						<NavLink
							role="menuitem"
							href="/projects"
							activePath="/projects"
							activeRegEx={/^\/projects\/[^\/]+$/}
							class="bg-white hover:bg-purple-5"
							activeClass="!bg-purple-5">Projects</NavLink
						>
					</li>
					<li role="none" class="list-none">
						<NavLink
							role="menuitem"
							href="/about"
							activePath="/about"
							class="bg-white hover:bg-purple-5"
							activeClass="!bg-purple-5">About</NavLink
						>
					</li>
					<li role="none" class="list-none">
						<NavLink
							role="menuitem"
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
