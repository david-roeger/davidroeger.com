<script lang="ts">
    export let type: 'primary' | 'secondary' | 'tertiary' = 'primary';
    export let id: string = undefined;
    export let unstyled = false;
    let c = '';
    export { c as class };
</script>

<div class="{unstyled ? '' : 'border-b border-mauve-6 p-2'} {c}">
    {#if type === 'secondary'}
        <h2 class={unstyled ? '' : 'text-2xl'} {id}>
            <slot />
        </h2>
    {:else if type === 'tertiary'}
        <h3 class={unstyled ? '' : 'text-xl'} {id}>
            <slot />
        </h3>
    {:else}
        <h1 class={unstyled ? '' : 'text-6xl'} {id}>
            <slot />
        </h1>
    {/if}
</div>
