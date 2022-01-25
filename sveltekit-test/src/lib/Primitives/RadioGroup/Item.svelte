<script lang="ts">
    import { buttonType } from '$lib/Actions';

    import { hasParentOfType } from '$lib/Utils';

    export let value: string;
    export let id: string = undefined;
    export let disabled = false;

    let c = '';
    export { c as class };

    import { getContext, setContext, onMount } from 'svelte';
    import { derived } from 'svelte/store';
    import type { RootContext } from './types';

    const { setRadio, activeValue, name, required }: RootContext =
        getContext('root');
    const active = derived(
        activeValue,
        ($activeValue) => $activeValue === value,
    );
    const dataState = derived(active, ($active) =>
        $active ? 'active' : 'inactive',
    );

    const handleClick = () => {
        if ($setRadio) $setRadio(value);
    };

    let button: HTMLButtonElement;
    let renderInput = false;
    onMount(() => {
        if (hasParentOfType(button, 'form')) {
            renderInput = true;
        }
    });

    setContext('item', {
        active: active,
    });
</script>

{#if renderInput}
    <input
        type="radio"
        {name}
        {value}
        checked={$active}
        aria-hidden="true"
        tabindex="-1"
        style="position: absolute; pointer-events: none; opacity: 0;"
        {disabled}
        {required}
    />
{/if}

<button
    {id}
    use:buttonType
    bind:this={button}
    on:click={handleClick}
    on:click
    type="button"
    role="radio"
    aria-checked={$active}
    data-state={$dataState}
    class={c}
    tabindex={$active ? 0 : -1}
    {disabled}
    aria-disabled={disabled}
>
    <slot />
</button>
