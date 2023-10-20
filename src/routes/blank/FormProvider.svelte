<script lang="ts">
	import { setFormContext } from '$form/formContext';
	import type { Form } from '$form/useForm';

	type TFormData = $$Generic;
	type ValidatorType = $$Generic;

	let formApi: Form<TFormData, ValidatorType>['api'];
	export { formApi as api };

	$: setFormContext({ formApi: formApi as never });
</script>

<slot />
