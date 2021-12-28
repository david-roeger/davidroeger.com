/**
 * check if element is descendant of another element with given type
 * @param element this
 * @param type HTML Element tag name
 * @returns boolean
 */
export const hasParentOfType = (element: HTMLElement, type: string): boolean => {
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
export const mapToRange = (value: number, x1: number, y1: number, x2: number, y2: number): number =>
	((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

/**
 * Adjust Value to Sin Curve so that results are more densed
 * @param value current Value
 * @param min current Min Value
 * @param max current Max Value
 * @returns number
 */
export const adjustScale = (value: number, min: number, max: number): number => {
	const nullMin = 0;
	const nullMax = max - min;
	const nullValue = value - min;
	const mean = nullMax / 2;

	const radiant = mapToRange(nullValue, nullMin, nullMax, 0, PI);
	const computed = nullValue > mean ? 2 - Math.sin(radiant) : Math.sin(radiant);
	const mapped = mapToRange(computed, 0, 2, nullMin, nullMax);

	return min + mapped;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cloneObject = (obj: { [key: string]: any }): { [key: string]: any } => {
	return JSON.parse(JSON.stringify(obj));
};

// eslint-disable-next-line
export const debounce = (func: { (): any }, ms: number) => {
	let timer: NodeJS.Timeout;
	return () => {
		clearTimeout(timer);
		timer = setTimeout(func, ms);
	};
};
