/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
    userid: string;
}

export interface ActionReturnType {
    update?: (params: T) => void | Promise<void>;
    destroy?: () => void;
}

export type GetReturnType = Promise<{
    status: number;
    body?: T;
}>;

export interface ProjectMetaData {
    order: number;
    title: string;
    description: string;
    slug: string;
    tags: string[];
    thumbnail: string;
    media: string[];
    published: boolean;
}
