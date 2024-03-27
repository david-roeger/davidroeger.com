const plugin = require('tailwindcss/plugin');

import {
	blue,
	crimson,
	cyan,
	grass,
	green,
	mauve,
	orange,
	plum,
	purple,
	red
} from '@radix-ui/colors';

function generateScale(scaleInput) {
	const scale = {};

	// for (const [key, value] of Object.entries(scaleInput)) {
	// 	const number = key.replace(/[^0-9]/g, '');
	// 	const
	// 	scale[number] = value;
	// }

	// for keys
	for (const key of Object.keys(scaleInput)) {
		const string = key.replace(/[^a-zA-Z]/g, '');
		const number = key.replace(/[^0-9]/g, '');
		scale[number] = `hsl(var(--drds-${string}-${number}) / <alpha-value>)`;
	}

	return scale;
}

function generateVariables(variableInput) {
	const variables = {};

	for (const [key, value] of Object.entries(variableInput)) {
		const string = key.replace(/[^a-zA-Z]/g, '');
		const number = key.replace(/[^0-9]/g, '');
		variables[`--drds-${string}-${number}`] = hexToHSL(value);
	}

	return variables;
}

module.exports = {
	content: ['./index.html', './src/**/*.{vue,svelte,js,ts,jsx,tsx,svx}'],
	mode: 'jit',
	theme: {
		colors: {
			transparent: 'transparent',
			white: '#ffffff',
			mauve: generateScale(mauve),
			blue: generateScale(blue),
			cyan: generateScale(cyan),
			crimson: generateScale(crimson),
			grass: generateScale(grass),
			green: generateScale(green),
			orange: generateScale(orange),
			plum: generateScale(plum),
			purple: generateScale(purple),
			red: generateScale(red)
		},
		extend: {
			width: {
				'fit-content': 'fit-content'
			},
			fontFamily: {
				sans: [
					'Inter var experimental',
					'ui-sans-serif',
					'system-ui',
					'sans-serif'
				],
				shantell: ['ShantellSansVariable']
			},
			screens: {
				xs: '320px'
			},
			fontSize: {
				'10xl': '10rem',
				'12xl': '12rem'
			},
			keyframes: {
				wave: {
					'0%, 100%': {
						transform: 'scale(1, .4)',
						'animation-timing-function':
							'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'scale(1, 1)',
						'animation-timing-function':
							'cubic-bezier(0, 0, 0.2, 1);'
					}
				},
				loading: {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'90%': {
						transform: 'rotate(360deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				wiggle: {
					'10%, 90%': { transform: 'translate(-1px)' },
					'20%,80%': { transform: 'translate(2px,-4px)' },
					'30%,50%,70%': { transform: 'translate(-4px,-4px)' },
					'40%,60%': { transform: 'translate(4px,-4px)' }
				}
			},
			animation: {
				'wave-1': 'wave 1.2s -200ms linear infinite',
				'wave-2': 'wave 1.8s -800ms linear infinite',
				'wave-3': 'wave 2.0s -500ms linear infinite',
				'wave-4': 'wave 1.4s -2s linear infinite',
				'loading-1':
					'loading 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;',
				'loading-2':
					'loading 1.8s 300ms cubic-bezier(0.4, 0, 0.2, 1) infinite;',
				'loading-3':
					'loading 1.8s 600ms cubic-bezier(0.4, 0, 0.2, 1) infinite;',
				'cool-wiggle': 'wiggle 0.82s cubic-bezier(.36,.07,.19,.97) both'
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		plugin(function ({ addBase }) {
			addBase({
				':root': {
					...generateVariables(mauve),
					...generateVariables(blue),
					...generateVariables(cyan),
					...generateVariables(crimson),
					...generateVariables(grass),
					...generateVariables(green),
					...generateVariables(orange),
					...generateVariables(plum),
					...generateVariables(purple),
					...generateVariables(red)
				}
			});
		}),
		plugin(function ({ addUtilities, theme }) {
			const colors = theme('colors', {});
			const iconColorUtilities = Object.keys(colors).map((key) => {
				if (typeof colors[key] == 'string') {
					return {
						[`.icon-${key}`]: {
							color: colors[key]
						}
					};
				} else {
					const nested = Object.keys(colors[key]).map((innerKey) => {
						return {
							[`.icon-${key}-${innerKey}`]: {
								color: colors[key][innerKey]
							}
						};
					});
					return nested;
				}
			});
			addUtilities(iconColorUtilities);
		}),
		plugin(function ({ addUtilities, theme }) {
			const fvsUtilities = {
				[`.fvs`]: {
					'--fvs-bnce': '0',
					'--fvs-infm': '0',
					'--fvs-spac': '0',
					'--fvs-ital': '0',
					'--fvs-wght': '400',
					'font-variation-settings':
						"'BNCE' var(--fvs-bnce), 'INFM' var(--fvs-infm), 'SPAC' var(--fvs-spac), 'ital' var(--fvs-ital), 'wght' var(--fvs-wght)"
				}
			};

			for (let i = 0; i <= 100; i++) {
				fvsUtilities[`.fvs-bnce-${i}`] = {
					'--fvs-bnce': `${i}`
				};
				fvsUtilities[`.-fvs-bnce-${i}`] = {
					'--fvs-bnce': `${-i}`
				};
				fvsUtilities[`.fvs-infm-${i}`] = {
					'--fvs-infm': `${i}`
				};

				fvsUtilities[`.fvs-spac-${i}`] = {
					'--fvs-spac': `${i / 100}`
				};
			}

			for (let i = 300; i <= 800; i++) {
				fvsUtilities[`.fvs-wght-${i}`] = {
					'--fvs-wght': `${i}`
				};
			}

			addUtilities(fvsUtilities);
		}),
		plugin(function ({ matchVariant }) {
			matchVariant(
				'aria-current',
				(value) => {
					return `&[aria-current="${value}"]`;
				},
				{
					values: {
						page: 'page'
					}
				}
			);
		})
	]
};

function hexToHSL(H) {
	// Convert hex to RGB first
	let r = 0,
		g = 0,
		b = 0;
	if (H.length == 4) {
		r = '0x' + H[1] + H[1];
		g = '0x' + H[2] + H[2];
		b = '0x' + H[3] + H[3];
	} else if (H.length == 7) {
		r = '0x' + H[1] + H[2];
		g = '0x' + H[3] + H[4];
		b = '0x' + H[5] + H[6];
	}
	// Then to HSL
	r /= 255;
	g /= 255;
	b /= 255;
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	if (delta == 0) h = 0;
	else if (cmax == r) h = ((g - b) / delta) % 6;
	else if (cmax == g) h = (b - r) / delta + 2;
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0) h += 360;

	l = (cmax + cmin) / 2;
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return `${h}deg ${s}% ${l}%`;
}
