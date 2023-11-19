export type Colors =
	| 'default'
	| 'red'
	| 'green'
	| 'orange'
	| 'blue'
	| 'purple'
	| 'custom';

export const constructColorClasses = <
	T extends Record<string, string>
>(colorClasses: {
	[K in Colors]: T;
}) => {
	return colorClasses;
};
