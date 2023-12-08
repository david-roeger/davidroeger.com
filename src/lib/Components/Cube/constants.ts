import { constructColorClasses } from '$utils/colors';

export const CUBE_COLOR_CLASSES = constructColorClasses({
	default: {
		front: 'bg-mauve-3',
		side: 'bg-mauve-3 group-hover/cube:bg-mauve-4 group-hover/cube-selector:bg-mauve-4',
		arrow: 'text-mauve-12'
	},
	red: {
		front: 'bg-red-4 group-hover/cube:bg-red-6 group-hover/cube-selector:bg-red-6',
		side: 'bg-red-6 group-hover/cube:bg-red-4 group-hover/cube-selector:bg-red-4',
		arrow: 'text-mauve-12'
	},
	green: {
		front: 'bg-green-4 group-hover/cube:bg-green-6 group-hover/cube-selector:bg-green-6',
		side: 'bg-green-6 group-hover/cube:bg-green-4 group-hover/cube-selector:bg-green-4',
		arrow: 'text-mauve-12'
	},
	orange: {
		front: 'bg-orange-4 group-hover/cube:bg-orange-6 group-hover/cube-selector:bg-orange-6',
		side: 'bg-orange-6 group-hover/cube:bg-orange-4 group-hover/cube-selector:bg-orange-4',
		arrow: 'text-mauve-12'
	},

	blue: {
		front: 'bg-blue-4 group-hover/cube:bg-blue-6 group-hover/cube-selector:bg-blue-6',
		side: 'bg-blue-6 group-hover/cube:bg-blue-4 group-hover/cube-selector:bg-blue-4',
		arrow: 'text-mauve-12'
	},

	purple: {
		front: 'bg-purple-4 group-hover/cube:bg-purple-6 group-hover/cube-selector:bg-purple-6',
		side: 'bg-purple-6 group-hover/cube:bg-purple-4 group-hover/cube-selector:bg-purple-4',
		arrow: 'text-mauve-12'
	},
	custom: {
		front: '',
		side: '',
		arrow: ''
	}
});
