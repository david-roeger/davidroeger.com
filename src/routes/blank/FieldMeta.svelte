<script lang="ts">
	import type { Field } from '$form/useField';
	import type { DeepKeys } from '@tanstack/form-core';

	type TParentData = $$Generic;

	type TName = DeepKeys<TParentData>;

	export let state: Field<TParentData, TName>['state'];
	$: console.log('FieldMeta', $state);
</script>

{#if $state.meta.touchedErrors}
	<em>{$state.meta.touchedErrors}</em>
{/if}

{#if $state.meta.isValidating}
	"Validating..."
{/if}
