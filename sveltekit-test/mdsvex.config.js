const config = {
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool',
	},

	layout: './src/routes/projects/_mdsvexLayout.svelte',

	remarkPlugins: [],
	rehypePlugins: [],
};

export default config;
