<script context="module" lang="ts">
	console.info('experimental Page: script module call');

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load() {
		return {
			status: 302,
			redirect: '/projects#experimental',
		};
	}
</script>

<script lang="ts">
	console.info('experimental Page: script call');
</script>
