export type Colors = 'default' | 'red' | 'green' | 'orange' | 'blue' | 'purple';

export const constructColorClasses = <
	T extends Record<string, string>
>(colorClasses: {
	[K in Colors]: T;
}) => {
	return colorClasses;
};

export const INPUT_COLOR_CLASSES = constructColorClasses({
	default: {
		default: 'bg-mauve-5',
		highlight: 'group-focus-within:bg-mauve-5'
	},
	red: {
		default: 'bg-red-5',
		highlight: 'group-focus-within:bg-red-5'
	},
	green: {
		default: 'bg-green-5',
		highlight: 'group-focus-within:bg-green-5'
	},
	orange: {
		default: 'bg-orange-5',
		highlight: 'group-focus-within:bg-orange-5'
	},
	blue: {
		default: 'bg-blue-5',
		highlight: 'group-focus-within:bg-blue-5'
	},
	purple: {
		default: 'bg-purple-5',
		highlight: 'group-focus-within:bg-purple-5'
	}
});
