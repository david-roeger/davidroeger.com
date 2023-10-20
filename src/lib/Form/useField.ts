import { FieldApi } from '@tanstack/form-core';
import type {
	DeepKeys,
	DeepValue,
	FieldApiOptions,
	FieldState
} from '@tanstack/form-core';
import { useStore, type NoInfer } from './useStore';
// import { defineComponent, onMounted, onUnmounted, watch } from 'vue-demi';
// import type { SlotsType, SetupContext, Ref } from 'vue-demi';
import { useFormContext } from './formContext';
import type { UseFieldOptions } from './types';
import { get, type Readable } from 'svelte/store';

export type Field<
	TParentData,
	TName extends DeepKeys<TParentData>,
	TData = DeepValue<TParentData, TName>
> = {
	api: FieldApi<
		TParentData,
		TName
		// Omit<typeof opts, 'onMount'> & {
		//   form: FormApi<TParentData>
		// }
	>;
	useStore: <TSelected = NoInfer<FieldState<TData>>>(
		selector?: (state: NoInfer<FieldState<TData>>) => TSelected
	) => Readable<TSelected>;
	state: Readable<
		FieldApi<
			TParentData,
			TName,
			TData
			// Omit<typeof opts, 'onMount'> & {
			//   form: FormApi<TParentData>
			// }
		>['state']
	>;
};

export type UseField<TParentData> = <
	TName extends DeepKeys<TParentData>,
	TData = DeepValue<TParentData, TName>
>(
	opts:
		| UseFieldOptions<TParentData, TName>
		| Readable<UseFieldOptions<TParentData, TName>>
) => Field<TParentData, TName, TData>;

export function useField<
	TParentData,
	TName extends DeepKeys<TParentData>,
	TData = DeepValue<TParentData, TName>
>(
	opts:
		| UseFieldOptions<TParentData, TName>
		| Readable<UseFieldOptions<TParentData, TName>>
): Field<TParentData, TName, TData> {
	const intialOpts = 'subscribe' in opts ? get(opts) : opts;

	// Get the form API either manually or from context
	const { formApi, parentFieldName } =
		'form' in intialOpts
			? { formApi: intialOpts.form, parentFieldName: undefined }
			: useFormContext();

	const fieldApi = (() => {
		const name = (
			typeof intialOpts.index === 'number'
				? [parentFieldName, intialOpts.index, intialOpts.name]
				: [parentFieldName, intialOpts.name]
		)
			.filter((d) => d !== undefined)
			.join('.');

		const api = new FieldApi({
			...intialOpts,
			form: formApi,
			// TODO: Fix typings to include `index` and `parentFieldName`, if present
			name: name as typeof intialOpts.name
		} as never);

		// api.Field = Field as never;

		return api;
	})();

	const useFieldStore: Field<TParentData, TName, TData>['useStore'] = (
		selector
	) => {
		return useStore(fieldApi.store as never, selector as never) as never;
	};

	const fieldState = useFieldStore((state) => state);

	if ('subscribe' in opts) {
		opts.subscribe((newOpts) => {
			fieldApi.update({ ...newOpts, form: formApi } as never);
		});
	}

	return {
		api: fieldApi,
		useStore: useFieldStore,
		state: fieldState
	} as never;
}

export type FieldValue<TParentData, TName> = TParentData extends any[]
	? unknown extends TName
		? TParentData[number]
		: DeepValue<TParentData[number], TName>
	: DeepValue<TParentData, TName>;

export type FieldComponentProps<
	TParentData,
	TName extends DeepKeys<TParentData>
> = (TParentData extends any[]
	? {
			name?: TName;
			index: number;
	  }
	: {
			name: TName;
			index?: never;
	  }) &
	Omit<UseFieldOptions<TParentData, TName>, 'name' | 'index'>;

// export type FieldComponent<TParentData> = <
// 	TName extends DeepKeys<TParentData>,
// 	TData = DeepValue<TParentData, TName>
// >(
// 	fieldOptions: FieldComponentProps<TParentData, TName>,
// 	context: SetupContext<
// 		{},
// 		SlotsType<{
// 			default: {
// 				field: FieldApi<TParentData, TName, TData>;
// 				state: FieldApi<TParentData, TName, TData>['state'];
// 			};
// 		}>
// 	>
// ) => any;

// export const Field = defineComponent(
// 	<TParentData, TName extends DeepKeys<TParentData>>(
// 		fieldOptions: UseFieldOptions<TParentData, TName>,
// 		context: SetupContext
// 	) => {
// 		const fieldApi = useField({ ...fieldOptions, ...context.attrs } as any);

// 		setFormContext({
// 			formApi: fieldApi.api.form,
// 			parentFieldName: fieldApi.api.name
// 		} as never);

// 		return () =>
// 			context.slots.default!({
// 				field: fieldApi.api,
// 				state: fieldApi.state.value
// 			});
// 	},
// 	{ name: 'Field', inheritAttrs: false }
// );
