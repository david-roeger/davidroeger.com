export const convertValueToPercentage = (value: number, min: number, max: number): number => {
	const maxSteps = max - min;
	const percentPerStep = 100 / maxSteps;
	return percentPerStep * (value - min);
};

/**
 * Returns a label for each thumb when there are two or more thumbs
 */
export const getLabel = (index: number, totalValues: number): string | undefined => {
	if (totalValues > 2) {
		return `Value ${index + 1} of ${totalValues}`;
	} else if (totalValues === 2) {
		return ['Minimum', 'Maximum'][index];
	} else {
		return undefined;
	}
};

/**
 * Offsets the thumb centre point while sliding to ensure it remains
 * within the bounds of the slider when reaching the edges
 */
export const getThumbInBoundsOffset = (width: number, left: number, direction: number): number => {
	const halfWidth = width / 2;
	const halfPercent = 50;
	const offset = linearScale([0, halfPercent], [0, halfWidth]);
	return (halfWidth - offset(left) * direction) * direction;
};

/**
 * Gets an array of steps between each value.
 *
 * @example
 * // returns [1, 9]
 * getStepsBetweenValues([10, 11, 20]);
 */
export const getStepsBetweenValues = (values: number[]): number[] => {
	return values.slice(0, -1).map((value, index) => values[index + 1] - value);
};

/**
 * Verifies the minimum steps between all values is greater than or equal
 * to the expected minimum steps.
 *
 * @example
 * // returns false
 * hasMinStepsBetweenValues([1,2,3], 2);
 *
 * @example
 * // returns true
 * hasMinStepsBetweenValues([1,2,3], 1);
 */
export const hasMinStepsBetweenValues = (
	values: number[],
	minStepsBetweenValues: number
): boolean => {
	if (minStepsBetweenValues > 0) {
		const stepsBetweenValues = getStepsBetweenValues(values);
		const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
		return actualMinStepsBetweenValues >= minStepsBetweenValues;
	}
	return true;
};

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
export const linearScale = (
	input: readonly [number, number],
	output: readonly [number, number]
): ((value: number) => number) => {
	return (value: number) => {
		if (input[0] === input[1] || output[0] === output[1]) return output[0];
		const ratio = (output[1] - output[0]) / (input[1] - input[0]);
		return output[0] + ratio * (value - input[0]);
	};
};

export const getDecimalCount = (value: number): number => {
	return (String(value).split('.')[1] || '').length;
};

export const roundValue = (value: number, decimalCount: number): number => {
	const rounder = Math.pow(10, decimalCount);
	return Math.round(value * rounder) / rounder;
};
