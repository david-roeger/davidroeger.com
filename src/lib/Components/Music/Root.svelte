<script lang="ts">
	export let labelledby: string | undefined = undefined;
</script>

<ul class="w-full" aria-labelledby={labelledby}>
	<slot />
</ul>
