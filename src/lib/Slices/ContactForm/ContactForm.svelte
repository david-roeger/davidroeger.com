<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { page } from '$app/stores';
	import Button from '$lib/Components/Button/Button.svelte';

	import { getContext } from 'svelte';
	import type { NotificationContext } from '$lib/Provider/NotificationProvider/types';
	import {
		COLOR_CLASSES,
		contactFormSchema,
		type ContactFormSchema
	} from './constants';
	import { getLoadingEmojis } from '$lib/Utils';

	export let variant:
		| 'default'
		| 'green'
		| 'red'
		| 'orange'
		| 'blue'
		| 'purple' = 'default';

	export let borderTop = false;
	export let borderBottom = true;

	let c = '';
	export { c as class };

	$: unsuccessfulSubmitted = $page.status !== 200;

	const {
		enhance,
		form,
		errors,
		tainted,
		constraints,
		message,
		submitting,
		delayed
	} = superForm($page.data.contactForm, {
		id: 'contactForm',
		validators: contactFormSchema,
		clearOnSubmit: 'none',
		taintedMessage: null
	});

	$: getValValidationClass = (
		key: keyof ContactFormSchema,
		classes: {
			successClass?: string;
			errorClass?: string;
			defaultClass?: string;
		}
	) => {
		const error = $errors[key];
		if (error && error.length > 0) {
			return classes.errorClass ?? '';
		}
		// after an unsuccessful submission each field should be in an error or success state
		if (
			(key in $errors && $tainted && $tainted[key]) ||
			unsuccessfulSubmitted
		) {
			return classes.successClass ?? '';
		}

		return classes.defaultClass ?? '';
	};

	const notificationContext: NotificationContext = getContext('notification');

	$: if ($submitting) {
		notificationContext.removeNotification('contactFormMessage');
	}

	$: if ($message) {
		notificationContext.addNotification({
			id: 'contactFormMessage',
			variant: $message.type,
			priority: $message.type === 'red' ? true : false,
			html: $message.html,
			closeIcon: true
		});
	}
</script>

<form
	use:enhance
	novalidate
	action="/contact"
	method="POST"
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
				disabled={$submitting}
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
							'name',
							{
								successClass: COLOR_CLASSES.green.highlight,
								errorClass: COLOR_CLASSES.red.highlight,
								defaultClass: COLOR_CLASSES[variant].highlight
							}
						)}"
					>
						Name*
					</label>
					<input
						id="name"
						class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
							'name',
							{
								successClass: 'to-green-5',
								errorClass: 'to-red-5'
							}
						)}"
						name="name"
						autocomplete="name"
						enterkeyhint="send"
						placeholder="vielleicht David"
						type="text"
						bind:value={$form.name}
						data-invalid={$errors.name}
						{...$constraints.name}
					/>
					<p class="text-xs h-4">
						{#if $errors.name}
							{$errors.name[0]}
						{/if}
					</p>
				</div>

				<div
					class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
				>
					<label
						for="email"
						class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
							'email',
							{
								successClass: COLOR_CLASSES.green.highlight,
								errorClass: COLOR_CLASSES.red.highlight,
								defaultClass: COLOR_CLASSES[variant].highlight
							}
						)}"
					>
						E-Mail*
					</label>
					<input
						id="email"
						class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
							'email',
							{
								successClass: 'to-green-5',
								errorClass: 'to-red-5'
							}
						)}"
						name="email"
						autocomplete="email"
						enterkeyhint="send"
						placeholder="email@example.com"
						type="email"
						bind:value={$form.email}
						data-invalid={$errors.email}
						{...$constraints.email}
					/>

					<p class="text-xs h-4">
						{#if $errors.email}
							{$errors.email[0]}
						{/if}
					</p>
				</div>

				<div
					class="flex flex-col items-start group max-w-xs sm:max-w-none lg:max-w-xs"
				>
					<label
						for="message"
						class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
							'message',
							{
								successClass: COLOR_CLASSES.green.highlight,
								errorClass: COLOR_CLASSES.red.highlight,
								defaultClass: COLOR_CLASSES[variant].highlight
							}
						)}"
					>
						Message*
					</label>
					<textarea
						rows="5"
						name="message"
						id="message"
						placeholder="Hi..."
						class="py-2 px-4 border-mauve-12 rounded-none resize-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
							'message',
							{
								successClass: 'to-green-5',
								errorClass: 'to-red-5'
							}
						)}"
						bind:value={$form.message}
						data-invalid={$errors.message}
						{...$constraints.message}
					/>

					<p class="text-xs h-4">
						{#if $errors.message}
							{$errors.message[0]}
						{/if}
					</p>
				</div>
			</fieldset>
			<div class="flex flex-col p-2 pt-0">
				<Button
					name="submit"
					type="submit"
					variant="rounded"
					class="flex flex-1 max-w-xs sm:max-w-none lg:max-w-xs {COLOR_CLASSES[
						variant
					].background}"
					disabled={$submitting}
				>
					<span
						class="grow grid grid-cols-[minmax(0,_1fr)_auto_minmax(0,_1fr)] place-items-start"
					>
						{#if $delayed}
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
			{#if $delayed}
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
		<div class="grow border-mauve-6 border-b" />
		<div class="border-mauve-6 border-b sm:hidden">
			<div class="h-[377px] sm:h-0" />
		</div>
		<div class="h-[58px]" />
	</div>
</form>

<style global>
	.custom-grid {
		--spacing-2: theme(spacing.2);
		grid-template-columns: var(--spacing-2) auto minmax(
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
