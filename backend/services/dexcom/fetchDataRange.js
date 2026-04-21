export async function fetchDataRange(AuthToken) {
    try {
        const resp = await fetch(
            `https://sandbox-api.dexcom.com/v3/users/self/dataRange`,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + AuthToken
                }
            }
        );
        const data = await resp.text();
        return JSON.parse(data);
    } catch (error) {
        console.error('Error fetching data range:', error);
        throw error;
    }
}