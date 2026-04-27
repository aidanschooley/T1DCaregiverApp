export async function formatDataRange() {
    const endTime = new Date();
    const startTime = new Date(endTime);
    startTime.setHours(endTime.getHours() - 3);

    // Remove the Z for Dexcom format
    const startDate = startTime.toISOString().slice(0, 19);
    const endDate = endTime.toISOString().slice(0, 19);

    // console.log(`Formatted Start Date: ${startDate}`);
    // console.log(`Formatted End Date: ${endDate}`);

    const query = new URLSearchParams({ startDate, endDate }).toString();
    return query;
}