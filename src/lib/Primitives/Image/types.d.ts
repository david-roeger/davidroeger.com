// https://github.com/JonasKruckenberg/imagetools/blob/main/packages/core/src/types.ts#L34

/**
 * The source output format.
 * Can be used to dynamically construct a sourceset string when you need to
 * choose between width descriptor, pixel density descriptor, or no descriptor.
 */
export interface Source {
	src: string;
	w: number;
}

/**
 * The picture output format.
 */
export interface Picture {
	sources: Record<string, Source[]>;
	img: {
		src: string;
		w: number;
		h: number;
	};
}
