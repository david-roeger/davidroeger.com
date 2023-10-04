import { mapToRange } from '$utils';
import BezierEasing from 'bezier-easing';

export const baseEasing = BezierEasing(0.4, 0, 0.2, 1);
export const reversedEasing = BezierEasing(0.8, 0, 0.6, 1);
export function slide(
	_: HTMLElement,
	{ start = -100, end = 0, duration = 150, easing = baseEasing }
) {
	return {
		duration,
		css: (t: number) => {
			const eased = easing(t);
			const mapped = mapToRange(eased, 0, 1, start, end);
			return `transform: translateX(${mapped}%); position: relative;`;
		}
	};
}
