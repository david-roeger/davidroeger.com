<script context="module">
    let id = 0;
</script>

<script lang="ts">
    export let defaultOpen: boolean;

    let c = '';
    export { c as class };

    import { setContext, createEventDispatcher, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import type { RootContext } from './types';
    import type { Writable } from 'svelte/store';

    import { useRect } from './useRect';
    import { useSize } from './useSize';
    import { convertStyleString } from '$utils';

    import { getPlacementData } from './popper';

    id++;
    const rootContext: RootContext = {
        id: `drds-popper-${id.toString()}`,
        trap: writable(undefined),
        open: writable(defaultOpen),
        setOpen: writable(undefined),
        setClose: writable(undefined),
        popperOptions: writable(undefined),
        triggerElement: writable(undefined),
        contentElement: writable(undefined),
        contentStyles: writable(''),
    };

    setContext('root', rootContext);
    const {
        open,
        trap,
        setOpen,
        setClose,
        popperOptions,
        triggerElement,
        contentElement,
        contentStyles,
    } = rootContext;

    $setOpen = () => {
        $open = true;
    };

    let triggerRect: Writable<{ rect: DOMRect; onDestroy: () => void }>;
    let contentSize: Writable<{
        size: {
            width: number;
            height: number;
        };
        onDestroy: () => void;
    }>;

    $: {
        if ($triggerElement && !$triggerRect) {
            triggerRect = useRect($triggerElement);
        }
        if ($contentElement && !$contentSize) {
            contentSize = useSize($contentElement);
        }
        if (
            $triggerRect &&
            $triggerRect.rect &&
            $contentSize &&
            $contentSize.size &&
            $popperOptions
        ) {
            const { popperStyles } = getPlacementData({
                triggerRect: $triggerRect.rect,
                popperSize: $contentSize.size,
                side: $popperOptions.side,
                sideOffset: $popperOptions.sideOffset,
                align: $popperOptions.align,
                alignOffset: $popperOptions.alignOffset,
                shouldAvoidCollisions: $popperOptions.shouldAvoidCollisions,
                collisionBoundariesRect: DOMRect.fromRect({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    x: 0,
                    y: 0,
                }),
                collisionTolerance: $popperOptions.collisionTolerance,
            });

            let string = '';

            for (const [key, value] of Object.entries(popperStyles)) {
                string += `${convertStyleString(key)}: ${value};
				`;
            }

            $contentStyles = string;
        }
    }

    const destroy = () => {
        if ($contentSize && $contentSize.onDestroy) {
            $contentSize.onDestroy();
            $contentSize = undefined;
        }
        if ($triggerRect && $triggerRect.onDestroy) {
            $triggerRect.onDestroy();
            $triggerRect = undefined;
        }
    };

    onDestroy(() => {
        destroy();
    });

    /* outside click && esc */
    $setClose = () => {
        if ($trap) {
            $trap.deactivate();
            $trap = undefined;
        }

        destroy();
        $open = false;
    };

    const dispatch = createEventDispatcher<{ openChange: { open: boolean } }>();
    $: dispatch('openChange', {
        open: $open,
    });
</script>

<div class={c}>
    <slot />
</div>
