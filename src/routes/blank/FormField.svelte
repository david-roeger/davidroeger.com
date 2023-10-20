<script lang="ts">
	import type { DeepKeys, DeepValue } from '@tanstack/form-core';

	import { useField, type FieldComponentProps } from '$form/useField';
	import { onMount } from 'svelte';
	import FormProvider from './FormProvider.svelte';

	type TParentData = $$Generic;

	type TName = DeepKeys<TParentData>;
	type TData = DeepValue<TParentData, TName>;

	type $$Props = FieldComponentProps<TParentData, TName>;

	const {
		api: field,
		state,
		useStore
	} = useField<TParentData, TName, TData>($$restProps as never);

	onMount(() => {
		const unmount = field.mount();
		return () => {
			unmount();
		};
	});

	const value = useStore((state) => state.value);
	$: console.log($value);
</script>

<FormProvider form={field.form}>
	<slot {field} {state} />
</FormProvider>
