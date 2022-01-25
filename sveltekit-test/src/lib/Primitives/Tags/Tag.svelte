<script lang="ts">
    export let value: string;
    export let disabled = false;

    let c = '';
    export { c as class };

    import { getContext } from 'svelte';
    import { derived } from 'svelte/store';
    import type { RootContext } from './types';

    const { setTags, activeValues, id }: RootContext = getContext('root');
    const active = derived(activeValues, ($activeValues) =>
        $activeValues.includes(value),
    );
    const dataState = derived(active, ($active) =>
        $active ? 'active' : 'inactive',
    );

    const handleClick = () => {
        if ($setTags) $setTags(value);
    };
</script>

<button
    on:click={handleClick}
    on:click
    type="button"
    role="switch"
    aria-checked={$active}
    aria-controls="{id}-list"
    data-state={$dataState}
    class={c}
    {disabled}
    aria-disabled={disabled}
>
    <slot />
</button>
