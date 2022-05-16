<script context="module" lang="ts">
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
