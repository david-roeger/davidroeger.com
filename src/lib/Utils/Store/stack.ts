import { writable } from 'svelte/store';

export function createStack<T>(current: T, maxLength = 100) {
	const stack = [current];

	let index = stack.length;

	const state = writable({
		first: true,
		last: true,
		index,
		current
	});

	function update() {
		current = stack[index - 1];

		state.set({
			first: index === 1,
			last: index === stack.length,
			index,
			current
		});

		return current;
	}

	return {
		push: (value: T) => {
			// if (index === maxLength) {
			// 	stack.shift();
			// 	index--;
			// }
			stack.length = index;
			stack[index++] = value;

			return update();
		},
		update: (fn: (c: T) => T) => {
			// if (index === maxLength) {
			// 	stack.shift();
			// 	index--;
			// }
			stack.length = index;
			stack[index++] = fn(current);

			return update();
		},
		undo: (jumpToStart = false) => {
			if (index > 1) {
				if (jumpToStart) {
					index = 1;
				} else {
					index -= 1;
				}
			}
			return update();
		},
		redo: (jumpToEnd = false) => {
			if (index < stack.length) {
				if (jumpToEnd) {
					index = stack.length;
				} else {
					index += 1;
				}
			}
			return update();
		},
		subscribe: state.subscribe
	};
}
