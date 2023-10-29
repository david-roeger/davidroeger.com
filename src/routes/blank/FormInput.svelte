<script lang="ts">
	import type { Field } from '$form/useField';
	import type { DeepKeys } from '@tanstack/form-core';

	type TParentData = $$Generic;

	type TName = DeepKeys<TParentData>;

	export let field: Field<TParentData, TName>['api'];
	export let state: Field<TParentData, TName>['state'];
</script>

<input
	name={field.name}
	value={$state.value}
	on:blur={field.handleBlur}
	on:input
	on:input={(e) => {
		console.log('input', e.target.value);
		field.handleChange(e.target.value);
	}}
	{...$$restProps}
/>
