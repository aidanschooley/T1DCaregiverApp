async function classifyPriority(bgValue) {
    if (bgValue < 54) {
        return 'P0';
    } else if (bgValue >= 54 && bgValue <= 70) {
        return 'P1';
    } else  if (bgValue > 250) {
        return 'P2';
    } else if (bgValue > 180 && bgValue <= 250) {
        return 'P3';
    } else {
        return 'P4';
    }
}

export { classifyPriority };