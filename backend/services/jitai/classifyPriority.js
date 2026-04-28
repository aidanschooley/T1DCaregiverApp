async function classifyPriority(bgValue, settings) {
    if (bgValue < settings.urgent_low_threshold) {
        return 'P0';
    } else if (bgValue >= settings.urgent_low_threshold && bgValue <= settings.low_threshold) {
        return 'P1';
    } else if (bgValue > settings.urgent_high_threshold) {
        return 'P2';
    } else if (bgValue > settings.high_threshold && bgValue <= settings.urgent_high_threshold) {
        return 'P3';
    } else {
        return 'P4';
    }
}

export { classifyPriority };