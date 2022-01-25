<script lang="ts">
    let c = '';
    export { c as class };
    export let target: HTMLElement | string = '#portal';
    import { portal } from '$actions';
</script>

<div class={c} use:portal={target}>
    <slot />
</div>
