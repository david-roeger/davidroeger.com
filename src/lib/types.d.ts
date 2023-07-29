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
	width: number;
	height: number;
	hash?: string;
}

export interface ProjectMediaData {
	[key: string]: Media;
}

export interface ProjectsMediaData {
	[key: string]: ProjectMediaData;
}

export interface ProjectFrontMatter {
	published: boolean;
	slug: string;
	order: number;
	title: string;
	meta?: string;
	description: string;
	date: string;
	tags: string[];
	team?: string[];
	place?: string;
	github?: string;
	link?: string;
	vertical: string;
	horizontal: string;
	media: string[];

	lastmod: string;
	keywords: string[];
}
export interface ProjectMetaData extends ProjectFrontMatter {
	// this gets added by the server
	html: string;
}

export interface Dream {
	id: number;
	text: string;
	emoji?: string;
	created_at: string;
	updated_at: string;
}
