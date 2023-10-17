export const wrapX = (x: number, length: number) => {
	if (x < 0) return length - 1;
	if (x > length - 1) return 0;
	return x;
};
export const wrapY = (y: number, length: number) => {
	if (y < 0) return length - 1;
	if (y > length - 1) return 0;
	return y;
};

export const calculateAliveNeighborsCount = (
	x: number,
	y: number,
	state: number[][],
	colCount: number,
	rowCount: number
) => {
	const topLeft = state[wrapY(y - 1, rowCount)][wrapX(x - 1, colCount)];
	const topCenter = state[wrapY(y - 1, rowCount)][wrapX(x, colCount)];
	const topRight = state[wrapY(y - 1, rowCount)][wrapX(x + 1, colCount)];

	const centerLeft = state[wrapY(y, rowCount)][wrapX(x - 1, colCount)];
	const centerRight = state[wrapY(y, rowCount)][wrapX(x + 1, colCount)];

	const bottomLeft = state[wrapY(y + 1, rowCount)][wrapX(x - 1, colCount)];
	const bottomCenter = state[wrapY(y + 1, rowCount)][wrapX(x, colCount)];
	const bottomRight = state[wrapY(y + 1, rowCount)][wrapX(x + 1, colCount)];

	return (
		topLeft +
		topCenter +
		topRight +
		centerLeft +
		centerRight +
		bottomLeft +
		bottomCenter +
		bottomRight
	);
};
