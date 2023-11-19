import { constructColorClasses } from '$utils/colors';

export const INPUT_COLOR_CLASSES = constructColorClasses({
	default: {
		default: 'bg-mauve-6',
		highlight:
			'group-focus-within:bg-mauve-6 group-focus-within:data-[state=valid]:bg-green-6 group-focus-within:data-[state=invalid]:bg-red-6',
		gradient:
			'bg-gradient-to-r from-transparent data-[state=valid]:to-green-6 data-[state=invalid]:to-red-6'
	},
	red: {
		default: 'bg-red-6',
		highlight:
			'group-focus-within:bg-red-6 group-focus-within:data-[state=valid]:bg-green-6 group-focus-within:data-[state=invalid]:bg-red-6',
		gradient:
			'bg-gradient-to-r from-transparent data-[state=valid]:to-green-6 data-[state=invalid]:to-red-6'
	},
	green: {
		default: 'bg-green-6',
		highlight:
			'group-focus-within:bg-green-6 group-focus-within:data-[state=valid]:bg-green-6 group-focus-within:data-[state=invalid]:bg-red-6',
		gradient:
			'bg-gradient-to-r from-transparent data-[state=valid]:to-green-6 data-[state=invalid]:to-red-6'
	},
	orange: {
		default: 'bg-orange-6',
		highlight:
			'group-focus-within:bg-orange-6 group-focus-within:data-[state=valid]:bg-green-6 group-focus-within:data-[state=invalid]:bg-red-6',
		gradient:
			'bg-gradient-to-r from-transparent data-[state=valid]:to-green-6 data-[state=invalid]:to-red-6'
	},
	blue: {
		default: 'bg-blue-6',
		highlight:
			'group-focus-within:bg-blue-6 group-focus-within:data-[state=valid]:bg-green-6 group-focus-within:data-[state=invalid]:bg-red-6',
		gradient:
			'bg-gradient-to-r from-transparent data-[state=valid]:to-green-6 data-[state=invalid]:to-red-6'
	},
	purple: {
		default: 'bg-purple-6',
		highlight:
			'group-focus-within:bg-purple-6 group-focus-within:data-[state=valid]:bg-green-6 group-focus-within:data-[state=invalid]:bg-red-6',
		gradient:
			'bg-gradient-to-r from-transparent data-[state=valid]:to-green-6 data-[state=invalid]:to-red-6'
	},
	custom: {
		default: '',
		filled: ''
	}
});
