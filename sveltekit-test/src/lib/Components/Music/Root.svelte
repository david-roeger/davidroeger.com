<script lang="ts">
	export let labelledby = '';
</script>

<ul class="w-full" aria-labelledby={labelledby}>
	<slot />
</ul>
