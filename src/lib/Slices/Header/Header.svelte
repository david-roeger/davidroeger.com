<script lang="ts">
	let c = '';
	export { c as class };

	import { AccessibleIcon } from '$components/AccessibleIcon';
	import { Logo } from '$components/Logo';
	import { NavLink } from '$components/NavLink';
	import * as VisuallyHidden from '$primitives/VisuallyHidden';

	import { page } from '$app/stores';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { BUTTON_COLOR_CLASSES } from '$utils/colors';

	const projectsRegex = /^\/projects/;
	const aboutRegex = /^\/about/;
	const contactRegex = /^\/contact/;
	const experimentalRegex = /^\/experimental/;

	$: getActiveClass = () => {
		if ($page.error) {
			return BUTTON_COLOR_CLASSES.red.filled;
		}

		const url = $page.url.pathname;

		if (projectsRegex.exec(url)) {
			return BUTTON_COLOR_CLASSES.green.filled;
		}
		if (aboutRegex.exec(url)) {
			return BUTTON_COLOR_CLASSES.purple.filled;
		}
		if (contactRegex.exec(url)) {
			return BUTTON_COLOR_CLASSES.orange.filled;
		}
		if (experimentalRegex.exec(url)) {
			return BUTTON_COLOR_CLASSES.blue.filled;
		}
		return BUTTON_COLOR_CLASSES.default.filled;
	};

	let spin = false;

	beforeNavigate(() => {
		spin = true;
	});

	afterNavigate(() => {
		spin = false;
	});
</script>

<div class="flex border-r sm:border-l border-mauve-6" />

<nav class="border-b xl:max-w-7xl border-mauve-6 {c}">
	<h3><VisuallyHidden.Root>Main Menu</VisuallyHidden.Root></h3>
	<ul class="flex justify-between">
		<li class="w-auto m-2 list-none shrink-0">
			<a
				class="block border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 transition-colors {getActiveClass()}"
				href="/"
				type="icon"
			>
				<AccessibleIcon
					label="Logo: {$page.error
						? 'sad'
						: 'happy'} smiley with four eyes - Go to Main Page"
				>
					<div
						class:animate-spin={spin}
						class="animate-spin duration-1000 transition-transform"
					>
						<Logo
							container={true}
							animated={true}
							smile={$page.error ? false : true}
							class="w-auto h-full"
						/>
					</div>
				</AccessibleIcon>
			</a>
		</li>

		<li class="flex-1">
			<ul
				role="menubar"
				class="flex flex-wrap items-center justify-end m-1"
			>
				<li role="none" class="m-1 list-none">
					<NavLink
						role="menuitem"
						href="/projects"
						variant="green"
						activePath="/projects"
						activeRegEx={projectsRegex}
						class="block"
					>
						Projects
					</NavLink>
				</li>
				<li aria-hidden="true"><span class="select-none">:</span></li>
				<li role="none" class="m-1 list-none">
					<NavLink
						role="menuitem"
						href="/about"
						variant="purple"
						activePath="/about"
						activeRegEx={aboutRegex}
						class="block"
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
						variant="orange"
						activePath="/contact"
						activeRegEx={contactRegex}
						class="block"
					>
						Say hi!
					</NavLink>
				</li>
			</ul>
		</li>
	</ul>
</nav>
