export const colorClasses = {
	default: {
		gradient: 'before:to-mauve-5',
		background: 'bg-mauve-5',
		focus: 'focus:bg-mauve-5',
		priority: 'bg-mauve-12'
	},
	red: {
		gradient: 'before:to-red-5',
		background: 'bg-red-5',
		focus: 'focus:bg-red-5',
		priority: 'bg-red-8'
	},
	green: {
		gradient: 'before:to-green-5',
		background: 'bg-green-5',
		focus: 'focus:bg-green-5',
		priority: 'bg-green-8'
	},
	orange: {
		gradient: 'before:to-orange-5',
		background: 'bg-orange-5',
		focus: 'focus:bg-orange-5',
		priority: 'bg-orange-8'
	},
	blue: {
		gradient: 'before:to-blue-5',
		background: 'bg-blue-5',
		focus: 'focus:bg-blue-5',
		priority: 'bg-blue-8'
	},
	purple: {
		gradient: 'before:to-purple-5',
		background: 'bg-purple-5',
		focus: 'focus:bg-purple-5',
		priority: 'bg-purple-8'
	}
};

export type ColorClassesKey = keyof typeof colorClasses;
