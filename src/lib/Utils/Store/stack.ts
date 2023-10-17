import { writable } from 'svelte/store';

export function createStack<T>(current: T, maxLength = 100) {
	const stack = [current];

	let index = stack.length;

	const state = writable({
		first: true,
		last: true,
		current
	});

	function update() {
		current = stack[index - 1];

		state.set({
			first: index === 1,
			last: index === stack.length,
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
		undo: () => {
			if (index > 1) index -= 1;
			return update();
		},
		redo: () => {
			if (index < stack.length) index += 1;
			return update();
		},
		subscribe: state.subscribe
	};
}
