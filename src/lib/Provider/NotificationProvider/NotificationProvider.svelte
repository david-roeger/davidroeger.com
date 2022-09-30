<script lang="ts">
	import { setContext } from 'svelte';
	import type { Notification, NotificationContext } from './types';
	import { tweened, type Tweened } from '$lib/Utils/Store/pausibleTween';
	import Progress from './Progress.svelte';
	import { get } from 'svelte/store';
	import Filter from '$assets/Icons/24/filter.svg?component';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import CloseIcon from '$assets/Icons/24/close.svg?component';
	import { fly, slide, type SlideParams } from 'svelte/transition';
	import { beforeNavigate } from '$app/navigation';
	import Background from '$lib/Components/Background/Background.svelte';
	import { colorClasses, type ColorClassesKey } from './constants';

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
			if (!notification.priority) {
				const index = notifications.findIndex((n) => !!n.priority);
				if (index !== -1) {
					notifications = [
						...notifications.slice(0, index),
						notification,
						...notifications.slice(index)
					];
					return;
				}
			}
			notifications = [...notifications, notification];
			return;
		}

		// not stack handling
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
		notifications.forEach((notification) => {
			removeNotification(notification.id);
		});
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
		console.log('run sync');
		if (!stack || notifications.length === 0) {
			lastNotifications = notifications;
			return;
		}

		const addedNotificationIndex = notifications.findIndex(
			(fn) => !lastNotifications.includes(fn)
		);
		if (addedNotificationIndex !== -1) {
			if (addedNotificationIndex === notifications.length - 1) {
				const n = notifications[addedNotificationIndex];
				if (n.progress) {
					if (!durations[n.id]) {
						durations = {
							...durations,
							[n.id]: addTween(n.id, n.duration ?? duration)
						};
					}
				}
				// pause prev tween
				console.log('pause prev tween');
				console.log(notifications, addedNotificationIndex);
				if (
					addedNotificationIndex > 0 &&
					notifications[addedNotificationIndex - 1] &&
					durations[notifications[addedNotificationIndex - 1].id]
				) {
					durations[
						notifications[addedNotificationIndex - 1].id
					].pause();
				}
			}
			lastNotifications = notifications;
			return;
		}

		const deleteNotificationsIndex = lastNotifications.findIndex(
			(fn) => !notifications.includes(fn)
		);
		if (deleteNotificationsIndex !== -1) {
			if (
				deleteNotificationsIndex === lastNotifications.length - 1 &&
				deleteNotificationsIndex > 0 &&
				notifications[deleteNotificationsIndex - 1]
			) {
				const n = notifications[deleteNotificationsIndex - 1];
				if (!durations[n.id] && n.progress) {
					durations = {
						...durations,
						[n.id]: addTween(n.id, n.duration ?? duration)
					};
				} else if (durations[n.id] && get(durations[n.id].paused)) {
					durations[n.id].resume();
				}
			}
			lastNotifications = notifications;
		}
	};

	$: syncNotifications(notifications);
	$: console.log(durations);
	setContext('notification', notificationContext);

	// TODO: add styling for head and subline
	// TODO: add start, end and close Icon handling
	// TODO: Add keyboard shortcuts

	const getGradientColorClass = (
		type: Notification['type'],
		variant: ColorClassesKey = 'default'
	) => {
		console.log(type);
		switch (type) {
			case 'success':
				return colorClasses.green.gradient;
			case 'error':
				return colorClasses.red.gradient;
			case 'warning':
				return colorClasses.orange.gradient;
			case 'info':
				return colorClasses.blue.gradient;
			case 'custom':
				return (
					colorClasses[variant]?.gradient ??
					colorClasses.default.gradient
				);
			default:
				return '';
		}
	};

	const getBackgroundColorClass = (
		type: Notification['type'],
		variant: keyof typeof colorClasses = 'default'
	) => {
		console.log(type);
		switch (type) {
			case 'success':
				return colorClasses.green.background;
			case 'error':
				return colorClasses.red.background;
			case 'warning':
				return colorClasses.orange.background;
			case 'info':
				return colorClasses.blue.background;
			case 'custom':
				return (
					colorClasses[variant]?.background ??
					colorClasses.default.background
				);
			default:
				return '';
		}
	};

	const getPriorityColorClass = (
		type: Notification['type'],
		variant: keyof typeof colorClasses = 'default'
	) => {
		switch (type) {
			case 'success':
			case 'error':
			case 'warning':
			case 'info':
				return colorClasses.default.priority;
			case 'custom':
				return (
					colorClasses[variant].priority ??
					colorClasses.default.priority
				);
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

	beforeNavigate(() => {
		removeAllNotifications();
	});
</script>

<div
	role="region"
	tabindex="-1"
	aria-live="polite"
	aria-label="Notifications (F8)"
	style="z-index: 99999; position: fixed; inset: 0; pointer-events: none;"
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
		class="max-h-full overflow-y-auto pointer-events-auto grid grid-rows-1 items-start {stack
			? 'grid-cols-1'
			: ''} bg-white"
	>
		{#each notifications as notification, index (notification.id)}
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
				tabindex={index === notifications.length - 1 ? 0 : undefined}
				class="{stack
					? 'col-start-1 row-start-1'
					: ''} relative bg-gradient-to-r from-white flex items-center border-b border-mauve-12 ring-inset focus:outline-none ring-mauve-12 focus:ring-1 {getGradientColorClass(
					notification.type,
					'variant' in notification ? notification.variant : 'default'
				)}"
				on:mouseenter={() => {
					if (notification.progress && durations[notification.id]) {
						hovered[notification.id] = true;
						durations[notification.id].pause();
					}
				}}
				on:focusin={() => {
					if (notification.progress && durations[notification.id]) {
						focused[notification.id] = true;
						durations[notification.id].pause();
					}
				}}
				on:mouseleave={() => {
					hovered[notification.id] = false;
					if (
						notification.progress &&
						durations[notification.id] &&
						!focused[notification.id] &&
						index === notifications.length - 1
					) {
						durations[notification.id].resume();
					}
				}}
				on:focusout={() => {
					focused[notification.id] = false;
					if (
						notification.progress &&
						durations[notification.id] &&
						!hovered[notification.id] &&
						index === notifications.length - 1
					) {
						durations[notification.id].resume();
					}
				}}
				on:click={() => {
					if (notification.closeOnClick && notification.id) {
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
										'variant' in notification
											? notification.variant
											: 'default'
									)}"
								/>
								<span
									class="col-start-1 row-start-1 inline-flex rounded-full h-2 w-2 {getPriorityColorClass(
										notification.type,
										'variant' in notification
											? notification.variant
											: 'default'
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
							on:click={() => removeNotification(notification.id)}
							class="focus:outline-none ring-mauve-12 focus:ring-1
							rounded-full flex items-center"
						>
							<AccessibleIcon label="Remove notification">
								<CloseIcon />
							</AccessibleIcon>
						</button>
					{/if}
				</div>
				<div
					class="grid grid-cols-1 grid-rows-1 absolute top-0 left-0 right-0 !m-0"
				>
					<div
						class="w-full h-0.5 row-start-1 col-start-1 {getBackgroundColorClass(
							notification.type,
							'variant' in notification
								? notification.variant
								: 'default'
						)}"
					/>
					{#if notification.progress}
						<Progress
							class="col-start-1 row-start-1 w-full h-0.5"
							min={0}
							max={notification.duration ?? duration}
							value={durations[notification.id]}
						/>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</div>

<slot />
