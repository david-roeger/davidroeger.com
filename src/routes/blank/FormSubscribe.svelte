<script lang="ts">
	import { useFormContext } from '$form/formContext';
	import { useStore, type NoInfer } from '$form/useStore';
	import type { FormApi, FormState } from '@tanstack/form-core';

	type TFormData = $$Generic;

	const { formApi } = useFormContext() as { formApi: FormApi<TFormData> };

	export let selector: <TSelected = NoInfer<FormState<TFormData>>>(
		state: NoInfer<FormState<TFormData>>
	) => TSelected;

	formApi.store;

	const result = useStore(formApi.store, selector);
</script>

<slot {...$result} />
