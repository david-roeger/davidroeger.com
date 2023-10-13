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

export const BUTTON_COLOR_CLASSES = constructColorClasses({
	default: {
		default: 'bg-white hover:bg-mauve-4 data-[state=active]:bg-mauve-5',
		filled: 'bg-mauve-5'
	},
	red: {
		default: 'bg-white hover:bg-red-4 data-[state=active]:bg-red-5',
		filled: 'bg-red-5'
	},
	green: {
		default: 'bg-white hover:bg-green-4 data-[state=active]:bg-green-5',
		filled: 'bg-green-5'
	},
	orange: {
		default: 'bg-white hover:bg-orange-4 data-[state=active]:bg-orange-5',
		filled: 'bg-orange-5'
	},
	blue: {
		default: 'bg-white hover:bg-blue-4 data-[state=active]:bg-blue-5',
		filled: 'bg-blue-5'
	},
	purple: {
		default: 'bg-white hover:bg-purple-4 data-[state=active]:bg-purple-5',
		filled: 'bg-purple-5'
	}
});

export const LINK_COLOR_CLASSES = constructColorClasses({
	default: {
		default: 'bg-white hover:bg-mauve-4 aria-current-page:bg-mauve-5',
		filled: 'bg-mauve-5'
	},
	red: {
		default: 'bg-white hover:bg-red-4 aria-current-page:bg-red-5',
		filled: 'bg-red-5'
	},
	green: {
		default: 'bg-white hover:bg-green-4 aria-current-page:bg-green-5',
		filled: 'bg-green-5'
	},
	orange: {
		default: 'bg-white hover:bg-orange-4 aria-current-page:bg-orange-5',
		filled: 'bg-orange-5'
	},
	blue: {
		default: 'bg-white hover:bg-blue-4 aria-current-page:bg-blue-5',
		filled: 'bg-blue-5'
	},
	purple: {
		default: 'bg-white hover:bg-purple-4 aria-current-page:bg-purple-5',
		filled: 'bg-purple-5'
	}
});
