import type {
	FieldOptions,
	DeepKeys,
	DeepValue,
	FieldApiOptions
} from '@tanstack/form-core';

export type UseFieldOptions<
	TParentData,
	TName extends DeepKeys<TParentData>,
	TData = DeepValue<TParentData, TName>
> = (
	| FieldOptions<TParentData, TName, TData>
	| FieldApiOptions<TParentData, TName, TData>
) & {
	mode?: 'value' | 'array';
};
