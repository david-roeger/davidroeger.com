const config = {
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool',
	},

	layout: { _: './src/routes/projects/_detail.svelte' },

	remarkPlugins: [],
	rehypePlugins: [],
};

export default config;
