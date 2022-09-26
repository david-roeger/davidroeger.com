<script lang="ts">
	console.info('contact: +page.svelte');

	import { applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/Components/Button/Button.svelte';
	import type { ActionData } from './$types';

	import Loading from '$assets/Icons/24/loading.svg?component';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { tick } from 'svelte';

	export let form: ActionData;
	let formEl: HTMLFormElement;

	$: name = typeof form?.values?.name === 'string' ? form.values.name : '';
	$: email = typeof form?.values?.email === 'string' ? form.values.email : '';
	$: tel = typeof form?.values?.tel === 'string' ? form.values.tel : '';
	$: message =
		typeof form?.values?.message === 'string' ? form.values.message : '';

	const getValValidationClass = (
		value: string | undefined,
		state: string | undefined,
		classes: {
			successClass?: string;
			errorClass?: string;
			defaultClass?: string;
		},
		required = false
	) => {
		if (!state || state === 'success' || (!value && !required))
			return classes.defaultClass ?? '';
		if (value) return classes.successClass ?? '';
		return classes.errorClass ?? '';
	};

	const focusInvalid = async (
		missing: { [key: string]: boolean } | undefined
	) => {
		if (missing) {
			const activeElement = document.activeElement;
			const name = activeElement?.getAttribute('name');
			if (name && missing[name] === true) {
				return;
			}

			for (const [key, value] of Object.entries(missing)) {
				if (value) {
					const element = document.getElementsByName(key)[0];
					if (element) {
						await tick();
						element.focus();
					}
					return;
				}
			}
		}
	};

	$: formState = form && form.state ? form.state : 'idle';

	const coords: { x: number | undefined; y: number | undefined } = {
		x: undefined,
		y: undefined
	};
	const handleMouse = ({ clientX, clientY }: MouseEvent) => {
		coords.x = clientX;
		coords.y = clientY;
	};
	const handleTouch = (e: TouchEvent) => {
		if (e.touches[0]) {
			coords.x = e.touches[0].clientX;
			coords.y = e.touches[0].clientY;
		}
	};

	async function handleSubmit() {
		if (formEl) {
			const activeElement = document.activeElement as HTMLElement | null;

			if (
				activeElement &&
				formEl.contains(activeElement) &&
				activeElement.tagName === 'INPUT'
			) {
				const { x, y, width, height } =
					activeElement.getBoundingClientRect();
				coords.x = x + width;
				coords.y = y + height / 2;
			}

			formState = 'submitting';
			const data = new FormData(formEl);

			const response = await fetch(formEl.action, {
				method: 'POST',
				body: data
			});

			const result: ActionResult = await response.json();

			if (result.type === 'success') {
				formEl.reset();
				if (activeElement && formEl.contains(activeElement)) {
					activeElement.blur();
				}
				await invalidateAll();
			}

			if (result.type === 'invalid' && result.data?.state === 'invalid') {
				console.log('Invalid');
				await focusInvalid(result.data?.missing);
			}

			await applyAction(result);
		}
	}
</script>

<svelte:window
	on:click={handleMouse}
	on:touchstart={handleTouch}
	on:touchend={handleTouch}
/>

<section class="mb-32">
	{#if form?.id}
		<p>{form.id}</p>
	{/if}

	<p>{JSON.stringify(form, undefined, 2)}</p>
	<p>{formState}</p>
	<form bind:this={formEl} on:submit|preventDefault={handleSubmit}>
		<fieldset class="flex flex-col max-w-xs space-y-4 m-4 text-mauve-12">
			<input type="hidden" name="url" value={$page.url.toString()} />
			<div class="flex flex-col items-start group">
				<label
					for="name"
					class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
						name,
						form?.state,
						{
							successClass: 'group-focus-within:bg-green-5',
							errorClass: 'group-focus-within:bg-red-5',
							defaultClass: 'group-focus-within:bg-orange-5'
						},
						true
					)}"
				>
					Name*
				</label>
				<input
					id="name"
					class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
						name,
						form?.state,
						{ successClass: 'to-green-5', errorClass: 'to-red-5' },
						true
					)}"
					name="name"
					autocomplete="name"
					type="text"
					value={name}
				/>
				{#if form?.missing?.name}
					<p class="text-xs">Name is required</p>
				{/if}
			</div>
			<div class="flex flex-col items-start group">
				<label
					for="email"
					class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
						email,
						form?.state,
						{
							successClass: 'group-focus-within:bg-green-5',
							errorClass: 'group-focus-within:bg-red-5',
							defaultClass: 'group-focus-within:bg-orange-5'
						},
						true
					)}"
				>
					E-Mail*
				</label>
				<input
					id="email"
					class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
						email,
						form?.state,
						{ successClass: 'to-green-5', errorClass: 'to-red-5' },
						true
					)}"
					name="email"
					autocomplete="email"
					type="email"
					value={email}
				/>
				{#if form?.missing?.email}
					<p class="text-xs">E-Mail is required</p>
				{/if}
			</div>

			<div class="flex flex-col items-start group">
				<label
					for="tel"
					class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
						tel,
						form?.state,
						{
							successClass: 'group-focus-within:bg-green-5',
							errorClass: 'group-focus-within:bg-red-5',
							defaultClass: 'group-focus-within:bg-orange-5'
						}
					)}"
				>
					Phone
				</label>
				<input
					id="tel"
					class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
						tel,
						form?.state,
						{ successClass: 'to-green-5', errorClass: 'to-red-5' }
					)}"
					name="tel"
					autocomplete="tel"
					type="tel"
					value={tel}
				/>
			</div>

			<div class="flex flex-col items-start group">
				<label
					for="message"
					class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
						message,
						form?.state,
						{
							successClass: 'group-focus-within:bg-green-5',
							errorClass: 'group-focus-within:bg-red-5',
							defaultClass: 'group-focus-within:bg-orange-5'
						},
						true
					)}"
				>
					Message*
				</label>
				<textarea
					rows="5"
					name="message"
					id="message"
					class="py-2 px-4 border-mauve-12 rounded-none resize-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
						message,
						form?.state,
						{ successClass: 'to-green-5', errorClass: 'to-red-5' },
						true
					)}"
					value={message}
				/>
				{#if form?.missing?.message}
					<p class="text-xs">Message is required</p>
				{/if}
			</div>

			<Button
				name="submit"
				type="submit"
				variant="rounded"
				class="bg-orange-5 flex"
				disabled={formState === 'submitting'}
			>
				<p class="grow">Submit!</p>
			</Button>
		</fieldset>
	</form>
	{#if formState === 'submitting'}
		<div
			style:top={coords.y ? `${coords.y}px` : undefined}
			style:left={coords.x ? `${coords.x}px` : undefined}
			class="absolute pointer-events-none {coords.y !== undefined
				? '-translate-y-1/2'
				: ''} {coords.y !== undefined ? '-translate-x-1/2' : ''}"
		>
			<Loading class="w-10 h-10 animate-loading" />
		</div>
	{/if}
</section>
