<script lang="ts">
	logger.page('blank: +page.svelte');
	// ----------------------------------------------------------------
	import { useForm } from '$form/useForm';
	import { logger } from '$utils/logger';
	import { get, writable } from 'svelte/store';
	import FormField from './FormField.svelte';
	import FormProvider from './FormProvider.svelte';

	import FieldMeta from './FieldMeta.svelte';
	import FormInput from './FormInput.svelte';
	import FormSubscribe from './FormSubscribe.svelte';

	const { Provider, ...form } = useForm({
		// Memoize your default values to prevent re-renders
		defaultValues: {
			firstName: 'error',
			lastName: '',
			hobbies: []
		},
		onSubmit: async (values) => {
			// Do something with form data
			console.log('submitting start');
			await new Promise((resolve) => setTimeout(resolve, 5000));

			console.log('submitting end', values);
		},
		onChange: (...args) => {
			console.log('change', args);
			return undefined;
		}
	});

	let hobbiesState = writable({ value: [] });

	form.state.subscribe((state) => {
		console.log('form state', state);
	});
</script>

<p>Test</p>
<Provider api={form.api}>
	<form
		on:submit={async (e) => {
			console.log('submit');
			e.preventDefault();
			e.stopPropagation();

			form.api.handleSubmit();
		}}
	>
		<div>
			<FormField
				name="firstName"
				onChange={(value) => {
					return !value
						? 'A first name is required'
						: value.length < 3
						? 'First name must be at least 3 characters'
						: undefined;
				}}
				onBlurAsync={async (value) => {
					console.log('onblur async started');
					await new Promise((resolve) => setTimeout(resolve, 1000));
					console.log('onblur async ended');
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
		</div>
		<div>
			<FormField
				name="hobbies"
				mode="array"
				state={hobbiesState}
				onChange={(value) => {
					console.log('hobbies onChange', value);
					return value.length < 3
						? 'Must have at least 3 hobbies'
						: undefined;
				}}
				let:field
				let:state
			>
				{#each $hobbiesState.value as hobby, i}
					<div>
						<FormInput
							{field}
							{state}
							name={i}
							value={hobby}
							on:input={(e) => {
								e.stopImmediatePropagation();
								console.log('input', e.target.value);
								console.log(
									'state',
									get(state),
									get(state).value.slice(0, i)
								);
								field.handleChange([
									...get(state).value.slice(0, i),
									e.target.value,
									...get(state).value.slice(i + 1)
								]);
							}}
						/>
						<button
							on:click={() => {
								field.removeValue(i);
							}}
						>
							Remove
						</button>
					</div>
				{/each}
				<button type="button" on:click={() => field.pushValue('')}>
					Add hobby
				</button>
				<FieldMeta {state} />
			</FormField>
		</div>
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
</Provider>
<button
	on:click={() => {
		a.api.setValue('random');
		a.api.validateAsync(a.api.getValue(), 'change');
	}}
>
	print
</button>
