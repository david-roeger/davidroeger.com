import { constructColorClasses } from '$utils/colors';

export const BUTTON_COLOR_CLASSES = constructColorClasses({
	default: {
		default: 'bg-white hover:bg-mauve-4 data-[state=active]:bg-mauve-6',
		filled: 'bg-mauve-6'
	},
	red: {
		default: 'bg-white hover:bg-red-4 data-[state=active]:bg-red-6',
		filled: 'bg-red-6'
	},
	green: {
		default: 'bg-white hover:bg-green-4 data-[state=active]:bg-green-6',
		filled: 'bg-green-6'
	},
	orange: {
		default: 'bg-white hover:bg-orange-4 data-[state=active]:bg-orange-6',
		filled: 'bg-orange-6'
	},
	blue: {
		default: 'bg-white hover:bg-blue-4 data-[state=active]:bg-blue-6',
		filled: 'bg-blue-6'
	},
	purple: {
		default: 'bg-white hover:bg-purple-4 data-[state=active]:bg-purple-6',
		filled: 'bg-purple-6'
	},
	custom: {
		default: '',
		filled: ''
	}
});
