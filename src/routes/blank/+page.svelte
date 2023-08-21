<script lang="ts">
	logger.page('blank: +page.svelte');
	// ----------------------------------------------------------------

	import { getContext } from 'svelte';

	import { EmojiPicker } from '$components/EmojiPicker';
	import { Button } from '$components/Button';

	import type { NotificationContext } from '$provider/NotificationProvider/types';

	import { logger } from '$utils/logger';

	const notificationContext: NotificationContext = getContext('notification');

	let index = 0;
	const add = () => {
		notificationContext.addNotification({
			id: Date.now().toString(),
			variant: 'default',
			headline: `${index}: Hello World)`,
			closeOnClick: true
		});
		index++;
	};

	const addCustomStyling = () => {
		notificationContext.addNotification({
			id: Date.now().toString(),
			variant: 'purple',
			headline: `${index}: Hello World)`,
			closeOnClick: true,
			startIcon: true
		});
		index++;
	};

	const addPrio = () => {
		notificationContext.addNotification({
			id: Date.now().toString(),
			headline: `${index}: Hello World (Prio)`,
			priority: true,
			closeOnClick: true,
			variant: 'orange'
		});
		index++;
	};

	const addProgress = () => {
		notificationContext.addNotification({
			id: Date.now().toString(),
			variant: 'green',
			headline: `${index}: Hello World (Progress)`,
			progress: true
		});
		index++;
	};
	const addProgressPrio = () => {
		notificationContext.addNotification({
			id: Date.now().toString(),
			variant: 'green',
			headline: `${index}: Hello World (Progress + Prio)`,
			subline: 'bla bla bla',
			progress: true,
			priority: true,
			startIcon: true,
			closeIcon: true
		});
		index++;
	};
</script>

<div class="flex flex-col p-2 space-y-2">
	<Button on:click={add}>Default</Button>
	<Button on:click={addPrio}>Priority</Button>
	<Button on:click={addProgress}>Progress</Button>
	<Button on:click={addProgressPrio}>Progress</Button>

	<Button on:click={addCustomStyling}>Custom</Button>
</div>
<form>
	<button name="hallo" value="a">Hallo</button>
</form>

<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<EmojiPicker name="emoji" />

<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
<p>Test</p>
