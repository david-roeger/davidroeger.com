import type { Media } from '$types';

export interface MediaSize {
	width: number;
	height: number;
	x: number;
	y: number;
	scale: number;

	targetWidth: number;
	targetHeight: number;
	targetX: number;
	targetY: number;
	targetScale: number;
}

export interface ActiveMedia extends MediaSize {
	index: number | undefined;
	media: Media | undefined;
}
