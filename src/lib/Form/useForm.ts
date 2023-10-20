import type { FormState, FormOptions } from '@tanstack/form-core';
import { FormApi, functionalUpdate } from '@tanstack/form-core';
import type { NoInfer } from './useStore';
import { useStore } from './useStore';

import { type UseField, useField } from './useField';
import { setFormContext } from './formContext';
import { get, type Readable } from 'svelte/store';

export type Form<TFormData, ValidatorType> = {
	api: FormApi<TFormData>;
	// Provider: (props: { children: any }) => any
	provideFormContext: () => void;
	// Field: FieldComponent<TFormData, ValidatorType>
	useField: UseField<TFormData>;
	useStore: <TSelected = NoInfer<FormState<TFormData>>>(
		selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
	) => Readable<TSelected>;
	state: Readable<FormApi<TFormData>['state']>;
	// Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
	//   selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
	//   children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
	// }) => any
};

{
}

export function useForm<TFormData, FormValidator>(
	opts?: FormOptions<TFormData> | Readable<FormOptions<TFormData>>
): Form<TFormData, FormValidator> {
	const formApi = (() => {
		const intialOpts = opts && 'subscribe' in opts ? get(opts) : opts;
		const api = new FormApi<TFormData>(intialOpts);

		// api.Subscribe = defineComponent(
		// 	(props, context) => {
		// 		const allProps = { ...props, ...context.attrs };
		// 		const selector = allProps.selector ?? ((state) => state);
		// 		const data = useStore(api.store as never, selector as never);
		// 		return () => context.slots.default!(data.value);
		// 	},
		// 	{
		// 		name: 'Subscribe',
		// 		inheritAttrs: false
		// 	}
		// );

		return api;
	})();

	const provideFormContext = () => {
		setFormContext({ formApi: formApi as never });
	};

	const useFormStore: Form<TFormData, FormValidator>['useStore'] = (
		selector
	) => {
		return useStore(formApi.store as never, selector as never) as never;
	};

	const formState = useFormStore((state) => state);

	const useFormField: Form<TFormData, FormValidator>['useField'] = (opts) =>
		useField({ form: formApi, ...opts });
	if (opts && 'subscribe' in opts) {
		opts.subscribe((newOpts) => {
			formApi.update(newOpts);
		});
	}

	/**
	 * formApi.update should not have any side effects. Think of it like a `useRef`
	 * that we need to keep updated every render with the most up-to-date information.
	 */
	return {
		api: formApi,
		provideFormContext,
		useStore: useFormStore,
		useField: useFormField,
		state: formState
	} as never;
}
