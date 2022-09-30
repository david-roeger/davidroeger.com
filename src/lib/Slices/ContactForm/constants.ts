export const colorClasses = {
	default: {
		background: 'bg-mauve-5',
		highlight: 'group-focus-within:bg-mauve-5'
	},
	red: {
		background: 'bg-red-5',
		highlight: 'group-focus-within:bg-red-5'
	},
	green: {
		background: 'bg-green-5',
		highlight: 'group-focus-within:bg-green-5'
	},
	orange: {
		background: 'bg-orange-5',
		highlight: 'group-focus-within:bg-orange-5'
	},
	blue: {
		background: 'bg-blue-5',
		highlight: 'group-focus-within:bg-blue-5'
	},
	purple: {
		background: 'bg-purple-5',
		highlight: 'group-focus-within:bg-purple-5'
	}
};

export type ColorClassesKey = keyof typeof colorClasses;
