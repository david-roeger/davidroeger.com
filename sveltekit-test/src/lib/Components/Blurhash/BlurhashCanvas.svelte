<script context="module">
	import hashes from '$assets/blurhash.map.json';
	import metadatas from '$assets/metadata.map.json';
</script>

<script lang="ts">
	import { decode, isBlurhashValid } from 'blurhash';
	import { onMount } from 'svelte';

	export let src: string;
	export let targetHeight: number = 0;
	export let targetWidth: number = 0;

	let c = '';
	export { c as class };

	const getCamelCaseName = (src: string) => {
		return src.split(/[./]+/).reduce((acc, part) => {
			if (!part) return acc;
			if (!acc) return part;
			return acc + part.charAt(0).toUpperCase() + part.slice(1);
		}, '');
	};

	const getBlurhashFromMap = (src: string) => {
		const name = getCamelCaseName(src);
		if (hashes[name]) {
			return JSON.parse(hashes[name]);
		}
		return '';
	};

	const getMetadataFromMap = (src: string) => {
		const name = getCamelCaseName(src);
		if (metadatas[name]) {
			return JSON.parse(metadatas[name]) as {
				width: number | undefined;
				height: number | undefined;
				format: string | undefined;
			};
		}
		return {
			width: undefined,
			height: undefined,
			format: undefined
		};
	};

	const hash = getBlurhashFromMap(src);
	const metadata = getMetadataFromMap(src);

	let canvas: HTMLCanvasElement;

	let width = targetWidth;
	let height = targetHeight;
	if (targetWidth) {
		if (!targetHeight && metadata.height !== undefined && metadata.width !== undefined) {
			height = Math.ceil((width / metadata.width) * metadata.height);
		}
	}
	if (targetHeight) {
		if (!targetWidth && metadata.height !== undefined && metadata.width !== undefined) {
			width = Math.ceil((height / metadata.height) * metadata.width);
		}
	}

	const setBlurhash = async (width: number, height: number) => {
		if (isBlurhashValid(hash)) {
			console.log(width, height);
			const pixels = decode(hash, width, height, 1);
			const ctx = canvas.getContext('2d');
			if (ctx) {
				const imageData = ctx.createImageData(width, height);
				imageData.data.set(pixels);
				ctx.putImageData(imageData, 0, 0);
			}
		}
	};

	onMount(() => {
		setBlurhash(width, height);
	});
</script>

<canvas bind:this={canvas} {width} {height} class={c} />
