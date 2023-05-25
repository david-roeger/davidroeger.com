<script lang="ts">
	let c = '';
	export { c as class };

	import { AccessibleIcon } from '$components/AccessibleIcon';
	import Logo from '$components/Logo/Logo.svelte';
	import { NavLink } from '$components/NavLink';
	import * as VisuallyHidden from '$primitives/VisuallyHidden';

	import { page } from '$app/stores';
	import { Marquee } from '../Marquee';

	const projectsRegex = /^\/projects/;
	const aboutRegex = /^\/about/;
	const contactRegex = /^\/contact/;
	const experimentalRegex = /^\/experimental/;

	$: getActiveClass = () => {
		if ($page.error) {
			return 'bg-[#FDD8D8]';
		}

		const url = $page.url.pathname;

		if (projectsRegex.exec(url)) {
			return 'bg-green-5';
		}
		if (aboutRegex.exec(url)) {
			return 'bg-purple-5';
		}
		if (contactRegex.exec(url)) {
			return 'bg-orange-5';
		}
		if (experimentalRegex.exec(url)) {
			return 'bg-blue-5';
		}
		return '';
	};
</script>

<div class="flex border-r sm:border-l border-mauve-6" />

<nav class="border-b xl:max-w-7xl border-mauve-6 {c}">
	<h3><VisuallyHidden.Root>Main Menu</VisuallyHidden.Root></h3>
	<ul class="flex justify-between">
		<li class="w-auto m-2 list-none shrink-0">
			<NavLink class="block {getActiveClass()}" href="/" type="icon">
				<slot name="logo">
					<AccessibleIcon
						label="Logo: {$page.error
							? 'sad'
							: 'happy'} smiley with four eyes - Go to Main Page"
					>
						<Logo
							container={true}
							animated={true}
							smile={$page.error ? false : true}
							class="w-auto h-full"
						/>
					</AccessibleIcon>
				</slot>
			</NavLink>
		</li>

		<li class="flex-1">
			<ul
				role="menubar"
				class="flex flex-wrap justify-end m-1 items-center"
			>
				<li role="none" class="m-1 list-none">
					<NavLink
						role="menuitem"
						href="/projects"
						activePath="/projects"
						activeRegEx={projectsRegex}
						class="block bg-white hover:bg-green-5"
						activeClass="!bg-green-5"
					>
						Projects
					</NavLink>
				</li>
				<li aria-hidden="true"><span class="select-none">:</span></li>
				<li role="none" class="m-1 list-none">
					<NavLink
						role="menuitem"
						href="/about"
						activePath="/about"
						activeRegEx={aboutRegex}
						class="block bg-white hover:bg-purple-5"
						activeClass="!bg-purple-5"
					>
						About
					</NavLink>
				</li>
				<li aria-hidden="true"><span class="select-none">:</span></li>
				<li role="none" class="m-1 list-none">
					<NavLink
						role="menuitem"
						href="/contact"
						type="button"
						activePath="/contact"
						activeRegEx={contactRegex}
						class="block bg-white hover:bg-orange-5"
						activeClass="!bg-orange-5"
					>
						Say hi!
					</NavLink>
				</li>
			</ul>
		</li>
	</ul>

	<Marquee title="← this guy is looking for new connections →" />
</nav>
