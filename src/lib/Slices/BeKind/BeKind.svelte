<script lang="ts">
	import { Image } from '$primitives/Image';

	import {
		Flower1,
		Flower2,
		Flower3,
		Flower4,
		Flower5,
		Flower6
	} from '$components/SvelteIcons';

	import { Marquee } from '$components/Marquee';
	import {AccessibleIcon} from '$components/AccessibleIcon';

	let c = '';
	export { c as class };

	export let count = 15;
</script>

<Marquee
	{count}
	class="bg-white/[.85] xl:border-r border-mauve-6 {c}"
	close={false}
	wrapperClass="ml-2 inline-flex items-center gap-1 shrink-0 "
>
	<span class="w-10 p-1">
		<!-- pink-5 and pink-11 -->
		<AccessibleIcon label="icon pink-colored flower">
			<Flower1 class="w-full h-full" fill="#F9D8EC" stroke="#CD1D8D" />
		</AccessibleIcon>
	</span>
	<span>Be Kind</span>
	<span class="w-10 p-1">
		<!-- yellow-5 and yellow-11 -->
		<AccessibleIcon label="icon yellow-colored flower">
			<Flower2 class="w-full h-full" fill="#FEF2A4" stroke="#946800" />
		</AccessibleIcon>
	</span>
	<span>Be Alive</span>
	<span class="w-10 p-1">
		<!-- violet-5 and violet-11 -->
		<AccessibleIcon label="icon violet-colored flower">
			<Flower3 class="w-full h-full" fill="#E4DEFC" stroke="#5746AF" />
		</AccessibleIcon>
	</span>
	<span>Be Proud</span>
	<span class="w-10 p-1">
		<!-- mint-5 and mint-11 -->
		<AccessibleIcon label="icon mint-colored flower">
			<Flower4 class="w-full h-full" fill="#C0EFE3" stroke="#147D6F" />
		</AccessibleIcon>
	</span>
	<span>Be Weird</span>
	<span class="w-10 p-1">
		<!-- tomato-5 and tomato-11 -->
		<AccessibleIcon label="icon tomato-colored flower">
			<Flower5 class="w-full h-full" fill="#FDD8D3" stroke="#CA3214" />
		</AccessibleIcon>
	</span>
	<span>Be You</span>
	<span class="w-10 p-1">
		<!-- lime-5 and lime-11 -->
		<AccessibleIcon label="icon lime-colored flower">
			<Flower6 class="w-full h-full" fill="#D7F2B0" stroke="#5D770D" />
		</AccessibleIcon>
	</span>
	<span class="w-10 h-full bg-mauve-3 border-x border-mauve-6" />
</Marquee>
