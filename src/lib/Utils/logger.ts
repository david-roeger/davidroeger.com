export const DEBUG_LEVEL = {
	CACHE: false,
	PAGE: true,
	LOCALS: false,
	ERROR: true
};

type Type = 'log' | 'info' | 'warn' | 'error' | 'time' | 'timeEnd';
const log = ({
	message,
	level,
	type = 'log'
}: {
	message: string;
	type?: Type;
	level: keyof typeof DEBUG_LEVEL;
}) => {
	if (DEBUG_LEVEL[level]) {
		console[type](message);
	}
};

export const logger = {
	cache: (message: string, type: Type = 'log') => {
		log({
			message: `@CACHE // ${message}`,
			type,
			level: 'CACHE'
		});
	},
	page: (message: string, type: Type = 'info') => {
		log({
			message: `@PAGE // ${message}`,
			type,
			level: 'PAGE'
		});
	},
	locals: (message: string, type: Type = 'info') => {
		log({
			message: `@LOCALS // ${message}`,
			type,
			level: 'LOCALS'
		});
	},
	error: (message: unknown, type: Type = 'error') => {
		log({
			message: `@ERROR`,
			type,
			level: 'ERROR'
		});
		log({
			message: JSON.stringify(message, null, 2),
			type,
			level: 'ERROR'
		});
	}
};
