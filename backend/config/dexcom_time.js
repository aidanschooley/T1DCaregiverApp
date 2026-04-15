function formatDexcomTime(date = new Date()) {
  const fiveMinAgo = new Date(date.getTime() - 5 * 60 * 1000);

  const format = (d) => {
    const ymd = d.toLocaleDateString('en-CA');
    const hms = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).split(' ')[0];
    return `${ymd}T${hms}`;
  };

  return [format(fiveMinAgo), format(date)];
}

export { formatDexcomTime };