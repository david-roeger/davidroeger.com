<script lang="ts">
	export let labelledby: string | undefined = undefined;
</script>

<ol class="w-full" aria-labelledby={labelledby}>
	<slot />
</ol>
