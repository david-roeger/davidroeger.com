<script lang="ts">
	import { setContext } from 'svelte';
	import type { Notification, NotificationContext } from './types';
	import { tweened, type Tweened } from '$lib/Utils/Store/pausibleTween';
	import Progress from './Progress.svelte';
	import { get } from 'svelte/store';
	import Filter from '$assets/Icons/24/filter.svg?component';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import CloseIcon from '$assets/Icons/24/close.svg?component';
	import { fly, scale, slide, type SlideParams } from 'svelte/transition';

	export let stack: boolean = false;
	export let duration: number = 5000;

	export function findLastIndex<T>(
		array: Array<T>,
		predicate: (value: T, index: number, obj: T[]) => boolean
	): number {
		let l = array.length;
		while (l--) {
			if (predicate(array[l], l, array)) return l;
		}
		return -1;
	}

	let notifications: Notification[] = [];
	let lastNotifications: Notification[] = [];
	let durations: { [key: string]: Tweened<number> } = {};
	let hovered: { [key: string]: boolean } = {};
	let focused: { [key: string]: boolean } = {};

	let state: 'idle' | 'adding' | 'removing' = 'idle';
	const addNotification = (notification: Notification) => {
		state = 'adding';
		if (!stack && notification.progress) {
			durations = {
				...durations,
				[notification.id]: addTween(
					notification.id,
					notification.duration ?? duration
				)
			};
		}

		if (stack) {
			if (notification.priority) {
				const index = findLastIndex(notifications, (n) => !!n.priority);
				if (index !== -1) {
					notifications = [
						...notifications.slice(0, index + 1),
						notification,
						...notifications.slice(index + 1)
					];
				} else {
					notifications = [notification, ...notifications];
				}
				return;
			}
			notifications = [...notifications, notification];
			return;
		}
		if (notification.priority) {
			notifications = [notification, ...notifications];
			return;
		}

		const index = findLastIndex(notifications, (n) => !!n.priority);
		if (index !== -1) {
			notifications = [
				...notifications.slice(0, index + 1),
				notification,
				...notifications.slice(index + 1)
			];
		} else {
			notifications = [notification, ...notifications];
		}
	};

	const removeNotification = (id: string) => {
		state = 'removing';
		notifications = notifications.filter(
			(notification) => notification.id !== id
		);
		delete durations[id];
		delete hovered[id];
		delete focused[id];
	};

	const removeAllNotifications = () => {
		notifications = [];
		durations = {};
		hovered = {};
		focused = {};
	};

	const notificationContext: NotificationContext = {
		addNotification,
		removeNotification,
		removeAllNotifications
	};

	const addTween = (id: string, duration: number) => {
		const size = tweened(duration, {
			duration
		});

		size.subscribe((value) => {
			if (value === 0) {
				removeNotification(id);
			}
		});

		size.set(0);
		return size;
	};

	const syncNotifications = (notifications: Notification[]) => {
		if (!stack || notifications.length === 0) {
			lastNotifications = notifications;
			return;
		}

		const addedNotificationIndex = notifications.findIndex(
			(ln) => !lastNotifications.includes(ln)
		);

		if (addedNotificationIndex !== -1) {
			if (addedNotificationIndex === 0) {
				const n = notifications[0];
				if (n.progress) {
					if (!durations[n.id]) {
						durations = {
							...durations,
							[n.id]: addTween(n.id, n.duration ?? duration)
						};
					}
				}
				if (notifications[1] && durations[notifications[1].id]) {
					durations[notifications[1].id].pause();
				}
			}
			lastNotifications = notifications;
			return;
		}

		const deleteNotificationsIndex = lastNotifications.findIndex(
			(ln) => !notifications.includes(ln)
		);
		if (deleteNotificationsIndex !== -1) {
			if (deleteNotificationsIndex === 0) {
				const n = notifications[0];
				if (!durations[n.id] && n.progress) {
					durations = {
						...durations,
						[n.id]: addTween(n.id, n.duration ?? duration)
					};
				} else if (durations[n.id] && get(durations[n.id].paused)) {
					durations[n.id].resume();
				}
			}
		}
	};

	$: syncNotifications(notifications);

	setContext('notification', notificationContext);

	// TODO: add styling for head and subline
	// TODO: add start, end and close Icon handling
	// TODO: Add keyboard shortcuts

	const getBackgroundColorClass = (
		type: Notification['type'],
		customClass?: string
	) => {
		switch (type) {
			case 'success':
				return 'to-green-5';
			case 'error':
				return 'to-red-5';
			case 'warning':
				return 'to-yellow-5';
			case 'info':
				return 'to-blue-5';
			case 'custom':
				return customClass ?? 'to-mauve-5';
			default:
				return '';
		}
	};

	const getPriorityColorClass = (
		type: Notification['type'],
		customClass?: string
	) => {
		switch (type) {
			case 'success':
			case 'error':
			case 'warning':
			case 'info':
				return 'bg-mauve-12';
			case 'custom':
				return customClass ?? 'bg-mauve-12';
			default:
				return '';
		}
	};

	interface AnmationArgs extends SlideParams {
		direction: 'in' | 'out';
	}
	const animate = (
		node: HTMLElement,
		{ direction, ...params }: AnmationArgs
	) => {
		if (direction === 'in') {
			if (state === 'adding') {
				return slide(node, params);
			}
			return slide(node, {
				...params,
				duration: 0
			});
		}
		// direction === 'out'
		if (state === 'removing') {
			return slide(node, params);
		}

		return slide(node, {
			...params,
			duration: 0,
			delay: 400
		});
	};
</script>

<div
	role="region"
	tabindex="-1"
	aria-live="polite"
	aria-label="Notifications (F8)"
	style="z-index: 99999; position: fixed; inset: 0; pointer-events: none;"
	class=" shadow-lg"
>
	{#if notifications.length}
		<ul
			in:slide={{ duration: 400 }}
			out:slide={{ duration: 400 }}
			class="flex space-x-2 items-center bg-white p-1 border-b border-mauve-12"
			aria-hidden
		>
			{#each notifications as notification, index (notification.id)}
				<li transition:fly={{ y: -12 }}>
					<span
						class="h-1 w-1 grid grid-cols-1 grid-rows-1 place-items-center"
					>
						<span
							class="col-start-1 row-start-1 inline-flex rounded-full h-full w-full bg-mauve-12 {notification.priority
								? 'opacity-100'
								: 'opacity-50'}"
						/>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
	<ol
		class="max-h-full overflow-y-auto pointer-events-auto grid grid-rows-1 {stack
			? 'grid-cols-1'
			: ''} bg-white"
	>
		{#each notifications as notification, index (notification.id)}
			{#if (stack && index === 0) || !stack}
				<li
					out:animate={{ direction: 'out' }}
					in:animate={{ direction: 'in' }}
					on:introstart={(e) => {
						e.currentTarget.style.zIndex =
							state === 'adding' ? '20' : '10';
					}}
					on:outrostart={(e) => {
						e.currentTarget.style.zIndex =
							state === 'removing' ? '20' : '10';
					}}
					tabindex="0"
					class="{stack
						? 'col-start-1 row-start-1'
						: ''} relative bg-gradient-to-r from-white flex items-center border-b border-mauve-12 ring-inset focus:outline-none ring-mauve-12 focus:ring-1 {getBackgroundColorClass(
						notification.type,
						notification.backgroundClass
					)}"
					on:mouseenter={() => {
						if (
							notification.progress &&
							durations[notification.id]
						) {
							hovered[notification.id] = true;
							durations[notification.id].pause();
						}
					}}
					on:focusin={() => {
						if (
							notification.progress &&
							durations[notification.id]
						) {
							focused[notification.id] = true;
							durations[notification.id].pause();
						}
					}}
					on:mouseleave={() => {
						hovered[notification.id] = false;
						if (
							notification.progress &&
							durations[notification.id] &&
							!focused[notification.id]
						) {
							durations[notification.id].resume();
						}
					}}
					on:focusout={() => {
						focused[notification.id] = false;
						if (
							notification.progress &&
							durations[notification.id] &&
							!hovered[notification.id]
						) {
							durations[notification.id].resume();
						}
					}}
					on:click={() => {
						if (notification.closeOnClick) {
							removeNotification(notification.id);
						}
					}}
				>
					<div class="w-full  p-2 flex space-x-2 items-center">
						{#if notification.priority}
							<div class="h-full p-2">
								<span
									class="!m-0 h-3 w-3 grid grid-cols-1 grid-rows-1 place-items-center"
								>
									<span
										class="col-start-1 row-start-1 animate-ping inline-flex h-full w-full rounded-full opacity-50 {getPriorityColorClass(
											notification.type,
											notification.priorityClass
										)}"
									/>
									<span
										class="col-start-1 row-start-1 inline-flex rounded-full h-full w-full {getPriorityColorClass(
											notification.type,
											notification.priorityClass
										)}
				"
									/>
								</span>
							</div>
						{/if}
						{#if notification.startIcon}
							<div>
								<!-- head -->
								<Filter />
							</div>
						{/if}
						<div class="flex-1 flex flex-col">
							{#if notification.html}
								{@html notification.html}
							{:else}
								<h3 class="text">
									{notification.headline}
								</h3>
								{#if notification.subline}
									<p class="text-xs">
										{notification.subline}
									</p>
								{/if}
							{/if}
						</div>
						{#if notification.endIcon}
							<div>
								<!-- head -->
								<Filter />
							</div>
						{/if}
						{#if notification.closeIcon}
							<button
								on:click={() =>
									removeNotification(notification.id)}
								class="focus:outline-none ring-mauve-12 focus:ring-1
							rounded-full flex items-center"
							>
								<AccessibleIcon label="Remove notification">
									<CloseIcon />
								</AccessibleIcon>
							</button>
						{/if}
					</div>
					{#if notification.progress}
						<div class="flex absolute top-0 left-0 right-0 !m-0">
							<Progress
								min={0}
								max={notification.duration ?? duration}
								value={durations[notification.id]}
							/>
						</div>
					{/if}
				</li>
			{/if}
		{/each}
	</ol>
</div>

<slot />
