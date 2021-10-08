export async function request(input: RequestInfo, init?: RequestInit) {
    const res = await fetch(input, init);
    console.log(input, init);
    console.log(res);
    if (res.status == 200) {
        return res.json();
    }
    console.error(`Request went wrong (Status: ${res.status})`);
    return {};
}
