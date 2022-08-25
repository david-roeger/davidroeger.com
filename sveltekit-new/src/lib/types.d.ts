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
	width?: string;
	height?: string;
	hash?: string;
}

export interface ProjectMediaData {
	[key: string]: Media;
}
export interface ProjectMetaData {
	order: number;
	title: string;
	slug: string;
	tags: string[];
	media: string[];
	vertical: string;
	horizontal: string;
	github: string;
	published: boolean;
}

export interface Dream {
	id: number;
	text: string;
	emoji?: Emoji.native;
	created_at: string;
	updated_at: string;
}
