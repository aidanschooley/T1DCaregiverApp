function formatDexcomTime(date = new Date()) {
  const fiveMinAgo = new Date(date.getTime() - 5 * 60 * 1000);

  const format = (d) => {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const seconds = String(d.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  return [format(fiveMinAgo), format(date)];
}

export { formatDexcomTime };