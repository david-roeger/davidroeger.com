import { constructColorClasses } from '$utils/colors';

export const LINK_COLOR_CLASSES = constructColorClasses({
	default: {
		default: 'bg-white hover:bg-mauve-4 aria-current-page:bg-mauve-6'
	},
	red: {
		default: 'bg-white hover:bg-red-4 aria-current-page:bg-red-6'
	},
	green: {
		default: 'bg-white hover:bg-green-4 aria-current-page:bg-green-6'
	},
	orange: {
		default: 'bg-white hover:bg-orange-4 aria-current-page:bg-orange-6'
	},
	blue: {
		default: 'bg-white hover:bg-blue-4 aria-current-page:bg-blue-6'
	},
	purple: {
		default: 'bg-white hover:bg-purple-4 aria-current-page:bg-purple-6'
	},
	custom: {
		default: '',
		filled: ''
	}
});
