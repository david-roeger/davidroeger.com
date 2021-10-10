const plugin = require('tailwindcss/plugin');

module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    mode: 'jit',
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
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
