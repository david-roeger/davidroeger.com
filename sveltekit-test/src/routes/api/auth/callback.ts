export async function post(): Promise<{
	status: number;
	body: Record<string, never>;
}> {
	return {
		status: 200,
		body: {},
	};
}
