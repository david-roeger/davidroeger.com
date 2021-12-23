<!--Dialog.Root>
    <Dialog.Trigger />
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Title />
        <Dialog.Description />
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root-->
<script lang="ts">
	export let defaultOpen: boolean;
	export let modal: boolean = false;
	export let id: string;

	let c = '';
	export { c as class };

	import { activeDialogs } from './store';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';

	const rootContext: RootContext = {
		id: `dialog-${id}`,
		modal: modal,
		trap: writable(undefined),
		open: writable(defaultOpen),
		setOpen: writable(undefined),
		setClose: writable(undefined)
	};
	setContext('root', rootContext);
	const { open, trap, setOpen, setClose } = rootContext;
	$setOpen = () => {
		$activeDialogs = [...$activeDialogs, id];
		document.body.classList.add('dialog-open');
		$open = true;
		console.log($activeDialogs);
		/*
		    overflow: hidden !important;
			position: relative !important;
			padding-left: 0px;
			padding-top: 0px;
			padding-right: 0px;
			margin-left: 0;
			margin-top: 0;
			margin-right: 0px !important;
		*/
	};
	$setClose = () => {
		if ($trap) {
			$trap.deactivate();
			$trap = undefined;
		}
		$activeDialogs = [...$activeDialogs.filter((activeDialog) => activeDialog !== id)];
		if ($activeDialogs.length === 0) {
			document.body.classList.remove('dialog-open');
		}
		$open = false;
	};

	const dispatch = createEventDispatcher<{ openChange: { open: boolean } }>();
	$: dispatch('openChange', {
		open: $open
	});
</script>

<div class={c}>
	<slot />
</div>
