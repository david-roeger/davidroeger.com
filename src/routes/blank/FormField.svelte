<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';

	import type { DeepKeys, DeepValue, FieldState } from '@tanstack/form-core';

	import { useField, type FieldComponentProps } from '$form/useField';
	import { onMount, tick } from 'svelte';
	import FormProvider from './FormProvider.svelte';

	type TParentData = $$Generic;

	type TName = DeepKeys<TParentData>;
	type TData = DeepValue<TParentData, TName>;

	type Props = FieldComponentProps<TParentData, TName>;
	type $$Props = Props & {
		state:
			| Writable<
					FieldState<DeepValue<TParentData, DeepKeys<TParentData>>>
			  >
			| undefined;
	};

	let s:
		| Writable<FieldState<DeepValue<TParentData, DeepKeys<TParentData>>>>
		| undefined = undefined;

	export { s as state };

	const {
		api: field,
		state,
		useStore
	} = useField<TParentData, TName, TData>($$restProps as never);

	onMount(() => {
		const unmount = field.mount();

		const unsubscribe = state.subscribe((value) => {
			if (s) {
				$s = value;
			}
		});

		return () => {
			unmount();
			unsubscribe();
		};
	});

	const value = useStore((state) => state.value);
	$: console.log('formfield', $value);
</script>

<FormProvider form={field.form}>
	<slot {field} {state} />
</FormProvider>
