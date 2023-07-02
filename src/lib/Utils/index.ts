export const DEBUG_LEVEL = {
	CACHE: true,
	PAGE: true
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
	page: (message: string, type: Type = 'log') => {
		log({
			message: `@PAGE // ${message}`,
			type,
			level: 'PAGE'
		});
	}
};

/**
 * check if element is descendant of another element with given type
 * @param element this
 * @param type HTML Element tag name
 * @returns boolean
 */
export const hasParentOfType = (
	element: HTMLElement,
	type: string
): boolean => {
	type = type.toUpperCase();
	let parent = element.parentElement;
	while (parent) {
		if (parent.tagName.toUpperCase() === type) {
			return true;
		}
		parent = parent.parentElement;
	}
	return false;
};

export const PI = Math.PI;
export const HALF_PI = Math.PI / 2;
export const QUARTER_PI = Math.PI / 4;
export const TWO_PI = Math.PI * 2;

/**
 * Map Value between to range
 * @param value current Value
 * @param x1 current Min Value
 * @param y1 current Max Value
 * @param x2 new Min Value
 * @param y2 new Max Value
 * @returns number
 */
export const mapToRange = (
	value: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number
): number => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

/**
 * Map Value between to range
 * @param value current Value
 * @param min min Value
 * @param max max Value
 * @returns number
 */
export const limit = (value: number, min: number, max: number): number =>
	Math.min(Math.max(min, value), max);

/**
 * Adjust Value to Sin Curve so that results are more densed
 * @param value current Value
 * @param min current Min Value
 * @param max current Max Value
 * @returns number
 */
export const adjustScale = (
	value: number,
	min: number,
	max: number
): number => {
	const nullMin = 0;
	const nullMax = max - min;
	const nullValue = value - min;
	const mean = nullMax / 2;

	const radiant = mapToRange(nullValue, nullMin, nullMax, 0, PI);
	const computed =
		nullValue > mean ? 2 - Math.sin(radiant) : Math.sin(radiant);
	const mapped = mapToRange(computed, 0, 2, nullMin, nullMax);

	return min + mapped;
};

export const unsafeClone = <T>(any: T): T => {
	return JSON.parse(JSON.stringify(any));
};

// TODO: refactor this with generics
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
	func: F,
	ms: number
): (...args: Parameters<F>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<F>): void => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), ms);
	};
}

/**
 * Write Query Params to URL
 * @param values key value pairs containing to new Query Params
 */
export const replaceStateWithQuery = (values: Record<string, string>): void => {
	const url = new URL(window.location.toString());
	for (const [key, value] of Object.entries(values)) {
		if (value) {
			url.searchParams.set(
				encodeURIComponent(key),
				encodeURIComponent(value)
			);
		} else {
			url.searchParams.delete(key);
		}
	}
	history.replaceState({}, '', url);
};

export const slugFromPath = (path: string): string | undefined =>
	path.match(/([\w-]+)\.(svelte\.md|md|svx|svelte)/i)?.[1] ?? undefined;

export const convertStyleString = (property: string): string =>
	property.replace(/([A-Z])/g, (v) => `-${v}`.toLowerCase());

// prettier-ignore
export const emojis = [
		'😄','😃','😀','😊','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','🚶','🏃','💃','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','🙋','💆','💇','💅','👰','🙎','🙍','🙇','🎩','👑','👒','👟','👞','👡','👠','👢','👕','👔','👚','👗','🎽','👖','👘','👙','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭','🐶','🐺','🐱','🐭','🐹','🐰','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐑','🐘','🐼','🐧','🐦','🐤','🐥','🐣','🐔','🐍','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐚','🐠','🐟','🐬','🐳','🐋','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐎','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐫','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🌾','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','🌠','⭐','☀','⛅','☁','⚡','☔','❄','⛄','🌀','🌁','🌈','🌊','🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🎋','🎉','🎊','🎈','🎌','🔮','🎥','📷','📹','📼','💿','📀','💽','💾','💻','📱','☎','📞','📟','📠','📡','📺','📻','🔊','🔉','🔈','🔇','🔔','🔕','📢','📣','⏳','⌛','⏰','⌚','🔓','🔒','🔏','🔐','🔑','🔎','💡','🔦','🔆','🔅','🔌','🔋','🔍','🛁','🛀','🚿','🚽','🔧','🔩','🔨','🚪','🚬','💣','🔫','🔪','💊','💉','💰','💴','💵','💷','💶','💳','💸','📲','📧','📥','📤','✉','📩','📨','📯','📫','📪','📬','📭','📮','📦','📝','📄','📃','📑','📊','📈','📉','📜','📋','📅','📆','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','📖','🔖','📛','🔬','🔭','📰','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎹','🎻','🎺','🎷','🎸','👾','🎮','🃏','🎴','🀄','🎲','🎯','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏁','🏇','🏆','🎿','🏂','🏊','🏄','🎣','☕','🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽','🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌃','🗽','🌉','🎠','🎡','⛲','🎢','🚢','⛵','🚤','🚣','⚓','🚀','✈','💺','🚁','🚂','🚊','🚉','🚞','🚆','🚄','🚅','🚈','🚇','🚝','🚋','🚃','🚎','🚌','🚍','🚙','🚘','🚗','🚕','🚖','🚛','🚚','🚨','🚓','🚔','🚒','🚑','🚐','🚲','🚡','🚟','🚠','🚜','💈','🚏','🎫','🚦','🚥','🚧','🔰','⛽','🏮','🎰','♨','🗿','🎪','🎭','📍','🚩','🔠','🔡','🔤','🔄','🆗','🔀','🔁','🔂','🆕','🆙','🆒','🆓','🆖','📶','🎦','🈁','🈯','🈳','🈵','🈴','🈲','🉐','🈹','🈺','🈶','🈚','🚻','🚹','🚺','🚼','🚾','🚰','🚮','🚸','⛔','❎','✅','💟','💠','➿','🕛','🕧','🕐','🕜','💮','🔘','🔗','➰','🔱',
	];

export const getRandomEmoji = (): string =>
	emojis[Math.floor(Math.random() * emojis.length)];

export const getRandomEmojis = (limit = 10): string[] => {
	const normalize = Math.max(0, Math.min(limit, emojis.length));
	const randomEmojis: Set<string> = new Set();
	while (randomEmojis.size < normalize) {
		randomEmojis.add(getRandomEmoji());
	}

	return [...randomEmojis];
};

export const toBase64 = (str: string) => {
	if (typeof window !== 'undefined') return window.btoa(str);
	return Buffer.from(str).toString('base64');
};
export const fromBase64 = (str: string) => {
	if (typeof window !== 'undefined') return window.atob(str);
	return Buffer.from(str, 'base64').toString('utf8');
};

// prettier-ignore
export const loadingEmojis = ['🌞','🌼','🌚','⭐️','🍥','🍪','🏵','💿','🧿','🪩','🔆'];

export const getLoadingEmojis = (count = 3) => {
	const emojis: string[] = [];
	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * loadingEmojis.length);
		const randomEmoji = loadingEmojis[randomIndex];
		if (!emojis.includes(randomEmoji)) {
			emojis.push(randomEmoji);
			continue;
		}
		i--;
	}
	return emojis;
};
