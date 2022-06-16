export async function post({ locals }): Promise<{
	status: number;
	body: {
		user: any;
		accessToken: any;
	};
}> {
	const { user, accessToken } = locals;
	return {
		status: 200,
		body: {
			user,
			accessToken,
		},
	};
}
