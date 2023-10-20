<script lang="ts">
	logger.page('blank: +page.svelte');
	// ----------------------------------------------------------------
	import { useForm } from '$form/useForm';
	import { logger } from '$utils/logger';
	import { get } from 'svelte/store';
	import FormField from './FormField.svelte';
	import FormProvider from './FormProvider.svelte';
	import { FieldApi, FormApi, type FormState } from '@tanstack/form-core';
	import { onMount } from 'svelte';
	import { shallow, useStore } from '$form/useStore';
	import { useField } from '$form/useField';
	import FieldMeta from './FieldMeta.svelte';
	import FormInput from './FormInput.svelte';
	import FormSubscribe from './FormSubscribe.svelte';

	const form = useForm({
		// Memoize your default values to prevent re-renders
		defaultValues: {
			firstName: 'a',
			lastName: ''
		},
		onSubmit: async (values) => {
			// Do something with form data
			console.log('submitting start');
			await new Promise((resolve) => setTimeout(resolve, 5000));

			console.log('submitting', values);
		},
		onChange: (...args) => {
			console.log('change', args);
			return undefined;
		}
	});

	// const field = (() => {
	// 	const api = new FieldApi({
	// 		form,
	// 		name: 'firstName',

	// 		onChange: (value) => {
	// 			console.log('onChange', value);
	// 			return !value
	// 				? 'A first name is required'
	// 				: value.length < 3
	// 				? 'First name must be at least 3 characters'
	// 				: undefined;
	// 		},
	// 		onChangeAsyncDebounceMs: 500,
	// 		onChangeAsync: async (value) => {
	// 			console.log('onchange async started');
	// 			await new Promise((resolve) => setTimeout(resolve, 1000));
	// 			console.log('onchange async ended');
	// 			return (
	// 				value.includes('error') &&
	// 				'No "error" allowed in first name'
	// 			);
	// 		}
	// 	});

	// 	// api.Field = Field as never;
	// 	console.log(api);
	// 	return api;
	// })();

	const a = form.useField({
		name: 'firstName',

		onChange: (value) => {
			console.log('onChange', value);
			return !value
				? 'A first name is required'
				: value.length < 3
				? 'First name must be at least 3 characters'
				: undefined;
		},
		onChangeAsyncDebounceMs: 500,
		onChangeAsync: async (value) => {
			console.log('onchange async started');
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('onchange async ended');
			return (
				value.includes('error') && 'No "error" allowed in first name'
			);
		}
	});

	onMount(() => {
		a.state.subscribe((state) => {
			console.log(
				'this comes form the form!',
				JSON.stringify(state, undefined, 2)
			);
		});

		const unsub = a.api.mount();
		return () => {
			unsub();
		};
	});
</script>

<p>Test</p>
<FormProvider api={form.api}>
	<form
		on:submit={(e) => {
			console.log('submit');
			e.preventDefault();
			e.stopPropagation();
			void form.api.handleSubmit();
		}}
	>
		<!--div>
			<FormField
				name="firstName"
				onChange={(value) => {
					console.log('onChange', value);
					return !value
						? 'A first name is required'
						: value.length < 3
						? 'First name must be at least 3 characters'
						: undefined;
				}}
				onChangeAsyncDebounceMs={500}
				onChangeAsync={async (value) => {
					console.log('onchange async started');
					await new Promise((resolve) => setTimeout(resolve, 1000));
					console.log('onchange async ended');
					return (
						value.includes('error') &&
						'No "error" allowed in first name'
					);
				}}
				let:field
				let:state
			>
				<FormInput {field} {state} />
				<FieldMeta {state} />
			</FormField>
		</div>
		<div>
			<FormField
				name="firstName"
				onChange={(value) => {
					console.log('onChange', value);
					return !value
						? 'A first name is required'
						: value.length < 3
						? 'First name must be at least 3 characters'
						: undefined;
				}}
				onChangeAsyncDebounceMs={500}
				onChangeAsync={async (value) => {
					console.log('onchange async started');
					await new Promise((resolve) => setTimeout(resolve, 1000));
					console.log('onchange async ended');
					return (
						value.includes('error') &&
						'No "error" allowed in first name'
					);
				}}
				let:field
				let:state
			>
				<FormInput {field} {state} />
				<FieldMeta {state} />
			</FormField>
		</div>
		<div>
			<FormField name="lastName" let:field let:state>
				<FormInput {field} {state} />
				<FieldMeta {state} />
			</FormField>
		</div-->
		<!--form.Subscribe
		selector={(state) => [state.canSubmit, state.isSubmitting]}
		children={([canSubmit, isSubmitting]) => (
		  <button type="submit" disabled={!canSubmit}>
			{isSubmitting ? "..." : "Submit"}
		  </button>
		)}
	  /-->
		<FormSubscribe
			selector={(state) => ({
				state
			})}
			let:state
		>
			<button type="submit">submit</button>
			<pre>{JSON.stringify(state, undefined, 2)}</pre>
		</FormSubscribe>
	</form>
</FormProvider>
<button
	on:click={() => {
		a.api.setValue('random');
		a.api.validateAsync(a.api.getValue(), 'change');
	}}
>
	print
</button>
