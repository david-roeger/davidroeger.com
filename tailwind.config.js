const plugin = require('tailwindcss/plugin');

module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    mode: 'jit',
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
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
                purple: {
                    1: 'hsl(300 94.3% 34.6% / 0.012)',
                    2: 'hsl(276 100% 51.0% / 0.020)',
                    3: 'hsl(277 99.6% 46.5% / 0.055)',
                    4: 'hsl(274 97.9% 44.3% / 0.095)',
                    5: 'hsl(276 98.6% 42.0% / 0.142)',
                    6: 'hsl(275 100% 39.2% / 0.200)',
                    7: 'hsl(273 99.2% 38.2% / 0.295)',
                    8: 'hsl(272 99.7% 37.6% / 0.424)',
                    9: 'hsl(272 99.6% 34.0% / 0.695)',
                    10: 'hsl(272 99.7% 32.0% / 0.730)',
                    11: 'hsl(272 99.8% 29.7% / 0.773)',
                    12: 'hsl(272 99.2% 11.3% / 0.946)',
                },
            },
            dropShadow: {
                mauve: '0 10px 8px rgba(hsl(272 99.2% 11.3% / 0.946), 0.1))',
            },
            fontFamily: {
                'neue-haas': [
                    'neue-haas-grotesk-display',
                    'ui-sans-serif',
                    'system-ui',
                ],
                cstmx: ['CSTMX'],
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
            },
            animation: {
                'wave-1': 'wave 1.2s -200ms linear infinite',
                'wave-2': 'wave 1.8s -800ms linear infinite',
                'wave-3': 'wave 2.0s -500ms linear infinite',
                'wave-4': 'wave 1.4s -2s linear infinite',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
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
