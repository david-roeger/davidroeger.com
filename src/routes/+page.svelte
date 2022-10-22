<script lang="ts">
	import { displace } from '$actions';
	import { applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import Head from '$lib/Components/Head/Head.svelte';
	import Logo from '$lib/Components/Logo/Logo.svelte';
	import { createForm } from '$lib/Utils/Form';
	import type { ActionResult } from '@sveltejs/kit';
	import { writable } from 'svelte/store';
	import type { ActionData } from './$types';

	console.info('index: +page.svelte');

	let { form } = createForm<ActionData>('defaultForm');

	$: first =
		$form && $form.defaultForm && 'first' in $form.defaultForm.values
			? $form.defaultForm.values.first
			: '';
	$: second =
		$form && $form.defaultForm && 'second' in $form.defaultForm.values
			? $form.defaultForm.values.second
			: '';
	$: message =
		$form && $form.defaultForm ? $form.defaultForm.message : 'No message';

	$: console.log('first', first);

	async function handleSubmit(
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const target = e.currentTarget;

		if (e.target) {
			// TODO: add delay handling
			const data = new FormData(target);

			const response = await fetch(target.action, {
				method: 'POST',
				body: data
			});

			const result: ActionResult = await response.json();
			console.log(target, result);

			if (result.type === 'success') {
				target.reset();
			}

			await applyAction(result);
		}
	}
</script>

<Head />

<section class="mb-32">
	<h1 class="relative p-2 grrrid text-8xl md:text-9xl lg:text-10xl">
		<span
			aria-hidden="true"
			class="absolute rounded-full min-w-[96px] min-h-[96px] mask grrrid-mask"
		/>
		<span
			aria-hidden="true"
			class="relative flex items-center rounded-full grrrid-smiley"
		>
			<span class="block">
				<Logo
					background={false}
					container={true}
					animated={true}
					smile={$page.error ? false : true}
					class="w-24 h-24 p-2 md:w-32 md:h-32 lg:h-40 lg:w-40"
				/>
			</span>
		</span>
		<span class="grrrid-child grrrid-child-0">D</span>
		<span class="grrrid-child grrrid-child-1">A</span>
		<span class="grrrid-child grrrid-child-2">V</span>
		<span class="grrrid-child grrrid-child-3">I</span>
		<span class="grrrid-child grrrid-child-4">D</span>
		<span class="grrrid-child grrrid-child-5">_</span>
		<span class="grrrid-child grrrid-child-6">R</span>

		<span class="relative inline-block grrrid-child grrrid-child-7">
			<span
				aria-hidden="true"
				class="absolute rounded-full mask top-4 right-2 bottom-4 left-2 md:top-6 md:right-4 md:bottom-6 md:left-4"
			/>
			<span class="relative">O</span>
		</span>
		<span class="grrrid-child grrrid-child-8">E</span>
		<span class="grrrid-child grrrid-child-9">G</span>
		<span class="grrrid-child grrrid-child-10">E</span>
		<span class="grrrid-child grrrid-child-11">R</span>
	</h1>
	<h2 class="text-8xl">
		<span class="break-all" use:displace>PROJECTS</span>
		<span class="break-all" use:displace>ABOUT</span>
		<span class="break-all" use:displace>SAY_HI</span>
	</h2>
</section>

<style>
	@media (min-width: 268px) {
		.grrrid {
			display: grid;
			align-items: center;
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.grrrid-mask {
			height: 100%;
			position: relative;
			grid-column: 1 / 4;
			grid-row: 1;
		}
		.grrrid-smiley {
			margin-left: auto;
			grid-column: 1 / -1;
			grid-row: 1;
		}

		.grrrid-child {
			position: relative;
			margin: 0 auto;
		}
	}

	@media (min-width: 320px) {
		.grrrid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.grrrid-smiley {
			grid-column: 1 / 4;
		}

		.grrrid-child-0 {
			grid-column: 4;
			grid-row: 1;
		}
	}

	@media (min-width: 560px) {
		.grrrid {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}

		.grrrid-mask {
			grid-column: 1 / 6;
			grid-row: 1;
		}

		.grrrid-smiley {
			grid-column: 4 / 6;
		}

		.grrrid-child-0 {
			grid-column: 2;
			grid-row: 1;
		}
		.grrrid-child-1 {
			grid-column: 3;
			grid-row: 1;
		}
		.grrrid-child-2 {
			grid-column: 3;
			grid-row: 2;
		}
		.grrrid-child-3 {
			grid-column: 4;
			grid-row: 2;
		}
		.grrrid-child-4 {
			grid-column: 1;
			grid-row: 3;
		}
		.grrrid-child-5 {
			grid-column: 4;
			grid-row: 3;
		}
		.grrrid-child-6 {
			grid-column: 5;
			grid-row: 3;
		}
		.grrrid-child-7 {
			grid-column: 6;
			grid-row: 3;
		}
		.grrrid-child-8 {
			grid-column: 3;
			grid-row: 4;
		}
		.grrrid-child-9 {
			grid-column: 4;
			grid-row: 4;
		}
		.grrrid-child-10 {
			grid-column: 5;
			grid-row: 4;
		}
		.grrrid-child-11 {
			grid-column: 5;
			grid-row: 5;
		}
	}

	.mask {
		background: linear-gradient(
					180deg,
					#d3b4ed 0%,
					rgba(211, 180, 237, 0) 50%
				)
				400%,
			linear-gradient(270deg, #ffb381 0%, rgba(255, 179, 129, 0) 50%),
			linear-gradient(360deg, #96c7f2 0%, rgba(150, 199, 242, 0) 50%),
			linear-gradient(90deg, #92ceac 0%, rgba(146, 206, 172, 0) 50%);
	}
</style>
