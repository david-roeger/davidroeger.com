module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    mode: 'jit',
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            keyframes: {
                sound: {
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
                'sound-1': 'sound 1.2s -200ms linear infinite',
                'sound-2': 'sound 1.8s -800ms linear infinite',
                'sound-3': 'sound 1.2s -200ms linear infinite',
                'sound-4': 'sound 1.4s -2s linear infinite',
                'sound-5': 'sound 2.9s -1.2s linear infinite',
                'sound-6': 'sound 2.1s -100ms linear infinite',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
