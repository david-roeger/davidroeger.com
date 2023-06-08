<script lang="ts">
	import { Image } from '$lib/Primitives/Image';

	import serious from '$assets/me/serious.png?w=40;80;120;160&format=webp;png&picture&imageTools';
	import smile from '$assets/me/smile.png?w=40;80;120;160&format=webp;png&picture&imageTools';

	import { Marquee } from '$lib/Components/Marquee';

	let c = '';
	export { c as class };

	export let title = '← this guy is looking for a job';
	export let href = '/contact';
	export let count = 15;
</script>

<Marquee
	{href}
	{count}
	class={c}
	wrapperClass="ml-2 inline-flex items-center gap-2 shrink-0"
>
	<span class="w-10">
		<Image picture={smile} alt="me smiling" />
	</span>
	<span>{title}</span>
	<span class="w-10">
		<Image picture={serious} alt="me" />
	</span>
	<span aria-hidden="true">
		{title}
	</span>
</Marquee>
