/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */

export interface ActionReturnType {
	update?: (params: T) => void | Promise<void>;
	destroy?: () => void;
}

export type GetReturnType = Promise<{
	status: number;
	body?: T;
}>;

export interface Media {
	src: string;
	width?: number;
	height?: number;
	hash?: string;
}

export interface ProjectMediaData {
	[key: string]: Media;
}

export interface ProjectsMediaData {
	[key: string]: ProjectMediaData;
}

export interface ProjectMetaData {
	order: number;
	title: string;
	meta: string;
	team?: string[];
	place?: string;
	date: string;
	github?: string;
	project?: string;
	tags: string[];
	vertical: string;
	horizontal: string;
	media: string[];
	published: boolean;

	// this gets added by the server
	slug: string;
	html: string;
}

export interface Dream {
	id: number;
	text: string;
	emoji?: Emoji.native;
	created_at: string;
	updated_at: string;
}
