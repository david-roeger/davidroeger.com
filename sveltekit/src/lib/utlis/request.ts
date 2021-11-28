/**
 * Make a request and parse the response
 * @param input URL
 * @param init Params
 * @returns repsonse
 */
export async function request(
    input: RequestInfo,
    init?: RequestInit,
): Promise<any> {
    const res = await fetch(input, init);
    console.log(input, init);
    console.log(res);
    if (res.status == 200) {
        return res.json();
    }
    console.error(`Request went wrong (Status: ${res.status})`);
    return { error: new Error(`Request went wrong (Status: ${res.status})`) };
}
