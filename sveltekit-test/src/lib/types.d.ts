/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}

export interface ActionReturnType {
	update: (params: T) => void | Promise<void>;
	destroy: () => void;
}
