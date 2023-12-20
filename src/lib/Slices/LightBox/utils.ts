import type { Media } from '$types';

export const createNestedMediaArray = (md: boolean, mediaArray: Media[]) => {
	const array: Media[][] = [];
	// this causes issues with the lighbox cause we get incorrect sizes from getBoundingClientRect after the tick
	const cols = /* md */ true ? 3 : 2;
	for (let i = 0; i < cols; i++) {
		array.push([]);
	}
	/* place media array items in nested media with <col> levels*/
	mediaArray.forEach((medium, index) => {
		array[index % cols].push(medium);
	});

	return array;
};

export const getTargetScale = (
	mediaWidth: number,
	mediaHeight: number,
	windowWidth: number,
	windowHeight: number
) => {
	const widthScale = mediaWidth / windowWidth;
	const heightScale = mediaHeight / windowHeight;
	return Math.max(widthScale, heightScale);
};
