<script lang="ts">
	let c = '';
	export { c as class };
	let defaultSubmit:
		| ((
				e: SubmitEvent & {
					currentTarget: EventTarget & HTMLFormElement;
				}
		  ) => Promise<boolean>)
		| undefined = undefined;
	export { defaultSubmit as handleSubmit };

	import { getContext } from 'svelte';

	import type { RootContext } from './types';

	const { setClose }: RootContext = getContext('root');

	const handleSubmit = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		if (defaultSubmit) {
			const success = await defaultSubmit(e);
			if (!success) {
				return;
			}
		}

		if ($setClose) $setClose();
	};
</script>

<form on:submit={handleSubmit} class={c}>
	<slot />
</form>
