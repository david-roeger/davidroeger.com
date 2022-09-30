<script lang="ts">
	import { setContext } from 'svelte';
	import type { Notification, NotificationContext } from './types';
	import { tweened, type Tweened } from '$lib/Utils/Store/pausibleTween';
	import Progress from './Progress.svelte';
	import { get } from 'svelte/store';
	import Filter from '$assets/Icons/24/filter.svg?component';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import CloseIcon from '$assets/Icons/24/close.svg?component';

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

	const addNotification = (notification: Notification) => {
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

	const getColorClass = (
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
				return customClass;
			default:
				return '';
		}
	};
</script>

<div
	role="region"
	tabindex="-1"
	aria-live="polite"
	aria-label="Notifications (F8)"
	style="z-index: 99999; position: fixed; inset: 0; pointer-events: none;"
	class="xl:max-w-[1288px]"
>
	<ol
		class="max-h-full overflow-y-auto pointer-events-auto flex flex-col p-2 space-y-2"
	>
		{#each notifications as notification, index (notification.id)}
			{#if (stack && index === 0) || !stack}
				<li
					tabindex="0"
					class="relative w-full bg-gradient-to-r from-white p-2 {notification.priority
						? 'border-2'
						: 'border'} border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 flex space-x-2 items-center {getColorClass(
						notification.type,
						notification.background
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
					{#if notification.startIcon}
						<div>
							<!-- head -->
							<Filter />
						</div>
					{/if}
					<div class="flex-1 flex flex-col space-y-2">
						{#if notification.html}
							{@html notification.html}
						{:else}
							<h3 class="text">
								{notification.headline}
								{durations[notification.id]}
							</h3>
							{#if notification.subline}
								<p class="text-sm">
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
							on:click={() => removeNotification(notification.id)}
							class="focus:outline-none ring-mauve-12 focus:ring-1
							rounded-full mb-auto"
						>
							<AccessibleIcon label="Remove notification">
								<CloseIcon />
							</AccessibleIcon>
						</button>
					{/if}
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
