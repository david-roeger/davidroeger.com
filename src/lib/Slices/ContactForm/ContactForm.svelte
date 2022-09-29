<script lang="ts">
	import { applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/Components/Button/Button.svelte';

	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { tick } from 'svelte';
	import type { ContactActionData } from '$routes/contact/+page.server';

	export let highlightClass = 'bg-orange-5';

	/**
	 * @info This should be prefixed with `group-focus-within:`
	 */
	export let labelDefaultClass = 'group-focus-within:bg-orange-5';

	export let borderTop = false;
	export let borderBottom = true;

	let c = '';
	export { c as class };

	$: form = $page.form as ContactFormActionData;
	let formEl: HTMLFormElement;

	$: name = typeof form?.values?.name === 'string' ? form.values.name : '';
	$: email = typeof form?.values?.email === 'string' ? form.values.email : '';
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

	async function handleSubmit() {
		if (formEl) {
			const activeElement = document.activeElement as HTMLElement | null;

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
				// we need to manully override the form state
				// because otherwise the fielgroup will still
				// be disabled when we try to focus the input
				formState = 'invalid';
				await focusInvalid(result.data?.missing);
			}

			await applyAction(result);
		}
	}

	const loadingEmojis = [
		'🌞',
		'🌼',
		'🌚',
		'⭐️',
		'🍥',
		'🍪',
		'🏵',
		'💿',
		'🧿',
		'🪩',
		'🔆'
	];

	const getLoadingEmojis = () => {
		const emojis: string[] = [];
		// get three random unique emojis from array
		for (let i = 0; i < 3; i++) {
			const randomIndex = Math.floor(
				Math.random() * loadingEmojis.length
			);
			const randomEmoji = loadingEmojis[randomIndex];
			if (!emojis.includes(randomEmoji)) {
				emojis.push(randomEmoji);
				continue;
			}
			i--;
		}
		return emojis;
	};
</script>

<form
	action="/contact"
	bind:this={formEl}
	on:submit|preventDefault={handleSubmit}
	class="grid custom-grid border-mauve-6 {borderTop
		? 'border-t'
		: ''} {borderBottom ? 'border-b' : ''} {c}"
>
	<div class="flex flex-col">
		<div class="border-mauve-6 border-b">
			<div class="h-12" />
		</div>
		<div class="grow border-mauve-6 border-b sm:hidden">
			<div class="" />
		</div>
		<div class="border-mauve-6 border-b sm:hidden">
			<div class="h-[377px] sm:h-0" />
		</div>
		<div class="sm:hidden"><div class="h-[58px]" /></div>
	</div>

	<div
		class="border-mauve-6 border-x bg-white/[.85] flex flex-col space-y-2 sm:flex-row sm:space-y-0 relative"
	>
		<div
			class="flex flex-col border-mauve-6 border-b space-y-2 sm:flex-1 sm:border-b-0"
		>
			<div class="border-mauve-6 border-b flex">
				<h2 class="text-2xl p-2">
					<slot name="headline">Kontakt</slot>
				</h2>
			</div>
			<p class="max-w-xs sm:max-w-none lg:max-w-xs p-2 pt-0">
				<slot>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Facilis vero aut sint officia quos omnis corrupti iusto et
					at fugit soluta ad, earum cum commodi! Minus in deserunt
					maiores, corrupti, cumque tempora, assumenda iure tempore
					nobis officia voluptatem facilis optio aut eaque labore
					nesciunt voluptas quam ut asperiores ad enim
				</slot>
			</p>
		</div>
		<div class="hidden sm:block h-full border-r border-mauve-6" />
		<div class="flex flex-col space-y-2 sm:flex-1 relative">
			<fieldset
				disabled={formState === 'submitting'}
				class="flex flex-col border-mauve-6 border-b space-y-2 p-2
					pt-0 sm:pt-2"
			>
				<input
					type="hidden"
					hidden
					name="url"
					value={$page.url.toString()}
				/>
				<div
					class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
				>
					<label
						for="name"
						class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
							name,
							form?.state,
							{
								successClass: 'group-focus-within:bg-green-5',
								errorClass: 'group-focus-within:bg-red-5',
								defaultClass: labelDefaultClass
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
							{
								successClass: 'to-green-5',
								errorClass: 'to-red-5'
							},
							true
						)}"
						name="name"
						autocomplete="name"
						type="text"
						value={name}
					/>
					<p class="text-xs h-4">
						{#if form?.missing?.name}
							Name is required
						{/if}
					</p>
				</div>

				<div
					class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
				>
					<label
						for="email"
						class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
							email,
							form?.state,
							{
								successClass: 'group-focus-within:bg-green-5',
								errorClass: 'group-focus-within:bg-red-5',
								defaultClass: labelDefaultClass
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
							{
								successClass: 'to-green-5',
								errorClass: 'to-red-5'
							},
							true
						)}"
						name="email"
						autocomplete="email"
						type="email"
						value={email}
					/>

					<p class="text-xs h-4">
						{#if form?.missing?.email}
							E-Mail is required
						{/if}
					</p>
				</div>

				<div
					class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
				>
					<label
						for="message"
						class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
							message,
							form?.state,
							{
								successClass: 'group-focus-within:bg-green-5',
								errorClass: 'group-focus-within:bg-red-5',
								defaultClass: labelDefaultClass
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
						class="py-2 px-4 h-full border-mauve-12 rounded-none resize-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
							message,
							form?.state,
							{
								successClass: 'to-green-5',
								errorClass: 'to-red-5'
							},
							true
						)}"
						value={message}
					/>

					<p class="text-xs h-4">
						{#if form?.missing?.message}
							Message is required
						{/if}
					</p>
				</div>
			</fieldset>
			<div class="flex flex-col p-2 pt-0">
				<Button
					name="submit"
					type="submit"
					variant="rounded"
					class="flex flex-1 max-w-xs sm:max-w-none lg:max-w-xs {highlightClass}"
					disabled={formState === 'submitting'}
				>
					<span
						class="grow grid grid-cols-[minmax(0,_1fr)_auto_minmax(0,_1fr)] place-items-start "
					>
						{#if formState === 'submitting'}
							<span class="-ml-2 px-1 bg-white rounded-full">
								🕸
							</span>
							<span class="col-start-2">Submitting...</span>
						{:else}
							<span class="-ml-2 px-1 bg-white rounded-full">
								💌
							</span>
							<span>Send</span>
						{/if}
					</span>
				</Button>
			</div>
			{#if formState === 'submitting'}
				<div
					class="absolute inset-0 bg-white/50 icon-mauve-12 flex justify-center items-center cursor-wait"
				>
					{#each getLoadingEmojis() as emoji}
						<p class="text-4xl animate-loading-1 m-4">
							{emoji}
						</p>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-col grid-cols-2">
		<div class="border-mauve-6 border-b sm:hidden">
			<div class="h-12 sm:h-0" />
		</div>
		<div class="grow border-mauve-6 border-b">
			<div class="sm:h-0" />
		</div>
		<div class="border-mauve-6 border-b sm:hidden">
			<div class="h-[377px] sm:h-0" />
		</div>
		<div><div class="h-[58px]" /></div>
	</div>
</form>

<style global>
	.custom-grid {
		--spacing-2: theme(spacing.2);
		grid-template-columns: var(--spacing-2) minmax(0, 322px) minmax(
				var(--spacing-2),
				1fr
			);
	}

	@media (min-width: 640px) {
		.custom-grid {
			grid-template-columns: var(--spacing-2) 1fr var(--spacing-2);
		}
	}

	@media (min-width: 768px) {
		.custom-grid {
			grid-template-columns: var(--spacing-2) 3fr 1fr;
		}
	}
</style>
