<script lang="ts">
    export let labelledby: string = undefined;
</script>

<ul class="w-full" aria-labelledby={labelledby}>
    <slot />
</ul>
