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
	<h1 class="text-12xl">
		<span class="break-all">DAVID_ROEGER</span>
		<span class="relative inline-block overflow-hidden rounded-full">
			<span aria-hidden="true" class="absolute mask inset-0 scale-[1]" />
			<AccessibleIcon label="Logo: Smiley with four eyes">
				<Logo
					background={false}
					container={true}
					animated={true}
					smile={$page.error ? false : true}
					class="w-36 h-36"
				/>
			</AccessibleIcon>
		</span>
	</h1>
	<h2 class="text-8xl">
		<span class="break-all" use:displace>PROJECTS</span>
		<span class="break-all" use:displace>ABOUT</span>
		<span class="break-all" use:displace>SAY_HI</span>
	</h2>
</section>

<style>
	.mask {
		background-size: 400%;
		background: linear-gradient(
				360deg,
				#96c7f2 0%,
				rgba(150, 199, 242, 0) 50%
			),
			linear-gradient(270deg, #ffb381 0%, rgba(255, 179, 129, 0) 50%),
			linear-gradient(180deg, #d3b4ed 0%, rgba(211, 180, 237, 0) 50%) 400%,
			linear-gradient(90deg, #92ceac 0%, rgba(146, 206, 172, 0) 50%);
	}
</style>
