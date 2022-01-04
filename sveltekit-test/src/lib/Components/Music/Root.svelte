<script lang="ts">
	export let labelledby = '';
</script>

<ul class="w-full" role="region" aria-labelledby={labelledby}>
	<slot />
</ul>
