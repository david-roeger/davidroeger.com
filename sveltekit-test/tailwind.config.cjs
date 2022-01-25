const plugin = require('tailwindcss/plugin');

module.exports = {
	content: ['./index.html', './src/**/*.{vue,svelte,js,ts,jsx,tsx,svx}'],
	mode: 'jit',
	theme: {
		colors: {
			transparent: 'transparent',
			white: '#ffffff',
			mauve: {
				1: 'hsl(300 20.0% 99.0%)',
				2: 'hsl(300 7.7% 97.5%)',
				3: 'hsl(294 5.5% 95.3%)',
				4: 'hsl(289 4.7% 93.3%)',
				5: 'hsl(283 4.4% 91.3%)',
				6: 'hsl(278 4.1% 89.1%)',
				7: 'hsl(271 3.9% 86.3%)',
				8: 'hsl(255 3.7% 78.8%)',
				9: 'hsl(252 4.0% 57.3%)',
				10: 'hsl(253 3.5% 53.5%)',
				11: 'hsl(252 4.0% 44.8%)',
				12: 'hsl(260 25.0% 11.0%)',
			},
			blue: {
				1: 'hsl(206 100% 99.2%)',
				2: 'hsl(210 100% 98.0%)',
				3: 'hsl(209 100% 96.5%)',
				4: 'hsl(210 98.8% 94.0%)',
				5: 'hsl(209 95.0% 90.1%)',
				6: 'hsl(209 81.2% 84.5%)',
				7: 'hsl(208 77.5% 76.9%)',
				8: 'hsl(206 81.9% 65.3%)',
				9: 'hsl(206 100% 50.0%)',
				10: 'hsl(208 100% 47.3%)',
				11: 'hsl(211 100% 43.2%)',
				12: 'hsl(211 100% 15.0%)',
			},
			cyan: {
				1: 'hsl(185 60.0% 98.7%)',
				2: 'hsl(185 73.3% 97.1%)',
				3: 'hsl(186 70.2% 94.4%)',
				4: 'hsl(186 63.8% 90.6%)',
				5: 'hsl(187 58.3% 85.4%)',
				6: 'hsl(188 54.6% 78.4%)',
				7: 'hsl(189 53.7% 68.7%)',
				8: 'hsl(189 60.3% 52.5%)',
				9: 'hsl(190 95.0% 39.0%)',
				10: 'hsl(191 91.2% 36.8%)',
				11: 'hsl(192 85.0% 31.0%)',
				12: 'hsl(192 88.0% 12.5%)',
			},
			crimson: {
				1: 'hsl(332 100% 99.4%)',
				2: 'hsl(330 100% 98.4%)',
				3: 'hsl(331 85.6% 96.6%)',
				4: 'hsl(331 78.1% 94.2%)',
				5: 'hsl(332 72.1% 91.1%)',
				6: 'hsl(333 67.0% 86.7%)',
				7: 'hsl(335 63.5% 80.4%)',
				8: 'hsl(336 62.3% 72.9%)',
				9: 'hsl(336 80.0% 57.8%)',
				10: 'hsl(336 73.7% 53.5%)',
				11: 'hsl(336 75.0% 47.2%)',
				12: 'hsl(340 65.0% 14.5%)',
			},
			grass: {
				1: 'hsl(116 50.0% 98.9%)',
				2: 'hsl(120 60.0% 97.1%)',
				3: 'hsl(120 53.6% 94.8%)',
				4: 'hsl(121 47.5% 91.4%)',
				5: 'hsl(122 42.6% 86.5%)',
				6: 'hsl(124 39.0% 79.7%)',
				7: 'hsl(126 37.1% 70.2%)',
				8: 'hsl(131 38.1% 56.3%)',
				9: 'hsl(131 41.0% 46.5%)',
				10: 'hsl(132 43.1% 42.2%)',
				11: 'hsl(133 50.0% 32.5%)',
				12: 'hsl(130 30.0% 14.9%)',
			},
			green: {
				1: 'hsl(136 50.0% 98.9%)',
				2: 'hsl(138 62.5% 96.9%)',
				3: 'hsl(139 55.2% 94.5%)',
				4: 'hsl(140 48.7% 91.0%)',
				5: 'hsl(141 43.7% 86.0%)',
				6: 'hsl(143 40.3% 79.0%)',
				7: 'hsl(146 38.5% 69.0%)',
				8: 'hsl(151 40.2% 54.1%)',
				9: 'hsl(151 55.0% 41.5%)',
				10: 'hsl(152 57.5% 37.6%)',
				11: 'hsl(153 67.0% 28.5%)',
				12: 'hsl(155 40.0% 14.0%)',
			},
			orange: {
				1: 'hsl(24 70.0% 99.0%)',
				2: 'hsl(24 83.3% 97.6%)',
				3: 'hsl(24 100% 95.3%)',
				4: 'hsl(25 100% 92.2%)',
				5: 'hsl(25 100% 88.2%)',
				6: 'hsl(25 100% 82.8%)',
				7: 'hsl(24 100% 75.3%)',
				8: 'hsl(24 94.5% 64.3%)',
				9: 'hsl(24 94.0% 50.0%)',
				10: 'hsl(24 100% 46.5%)',
				11: 'hsl(24 100% 37.0%)',
				12: 'hsl(15 60.0% 17.0%)',
			},
			plum: {
				1: 'hsl(292 90.0% 99.4%)',
				2: 'hsl(300 100% 98.6%)',
				3: 'hsl(299 71.2% 96.4%)',
				4: 'hsl(299 62.0% 93.8%)',
				5: 'hsl(298 56.1% 90.5%)',
				6: 'hsl(296 51.3% 85.8%)',
				7: 'hsl(295 48.2% 78.9%)',
				8: 'hsl(292 47.7% 70.8%)',
				9: 'hsl(292 45.0% 51.0%)',
				10: 'hsl(292 50.2% 46.9%)',
				11: 'hsl(292 60.0% 42.5%)',
				12: 'hsl(291 66.0% 14.0%)',
			},
			purple: {
				1: 'hsl(280 65.0% 99.4%)',
				2: 'hsl(276 100% 99.0%)',
				3: 'hsl(276 83.1% 97.0%)',
				4: 'hsl(275 76.4% 94.7%)',
				5: 'hsl(275 70.8% 91.8%)',
				6: 'hsl(274 65.4% 87.8%)',
				7: 'hsl(273 61.0% 81.7%)',
				8: 'hsl(272 60.0% 73.5%)',
				9: 'hsl(272 51.0% 54.0%)',
				10: 'hsl(272 46.8% 50.3%)',
				11: 'hsl(272 50.0% 45.8%)',
				12: 'hsl(272 66.0% 16.0%)',
			},
		},
		extend: {
			width: {
				'fit-content': 'fit-content',
			},
			fontFamily: {
				sans: ['Inter var', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'10xl': '10rem',
				'12xl': '12rem',
			},
			keyframes: {
				wave: {
					'0%, 100%': {
						transform: 'scale(1, .4)',
						'animation-timing-function':
							'cubic-bezier(0.8, 0, 1, 1)',
					},
					'50%': {
						transform: 'scale(1, 1)',
						'animation-timing-function':
							'cubic-bezier(0, 0, 0.2, 1);',
					},
				},
				loading: {
					'0%': {
						transform: 'rotate(0deg)',
					},
					'75%': {
						transform: 'rotate(360deg)',
					},
					'100%': {
						transform: 'rotate(360deg)',
					},
				},
			},
			animation: {
				'wave-1': 'wave 1.2s -200ms linear infinite',
				'wave-2': 'wave 1.8s -800ms linear infinite',
				'wave-3': 'wave 2.0s -500ms linear infinite',
				'wave-4': 'wave 1.4s -2s linear infinite',
				loading: 'loading 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		plugin(function ({ addUtilities, theme }) {
			const colors = theme('colors', {});
			const iconColorUtilities = Object.keys(colors).map((key) => {
				if (typeof colors[key] == 'string') {
					return {
						[`.icon-${key}`]: {
							color: colors[key],
						},
					};
				} else {
					const nested = Object.keys(colors[key]).map((innerKey) => {
						return {
							[`.icon-${key}-${innerKey}`]: {
								color: colors[key][innerKey],
							},
						};
					});
					return nested;
				}
			});
			addUtilities(iconColorUtilities);
		}),
	],
};
