export type Colors = 'default' | 'red' | 'green' | 'orange' | 'blue' | 'purple';

export const constructColorClasses = <
	T extends Record<string, string>
>(colorClasses: {
	[K in Colors]: T;
}) => {
	return colorClasses;
};
