export function classifyEvent(glucose, trend = null, lowCountLastHour = 0, highCountLastHour = 0, isNocturnal = false, isRecovering = false) {
  if (glucose < 54) {
    return { id: 1, name: 'critical low', description: 'Severe hypoglycemia' };
  }

  if (glucose < 70) {
    if (lowCountLastHour >= 3) {
      return { id: 4, name: 'repeated unresolved low', description: 'Still low after alerts' };
    }
    if (isNocturnal) {
      return { id: 2, name: 'nocturnal low', description: 'Overnight low' };
    }
    return { id: 3, name: 'standard low', description: 'General low event' };
  }
  if (glucose > 250) {
    return { id: 6, name: 'severe high', description: 'Severe hyperglycemia' };
  }

  if (glucose > 180) {
    if (highCountLastHour >= 3) {
      return { id: 8, name: 'repeated unresolved high', description: 'Persistently high' };
    }
    return { id: 7, name: 'mild high', description: 'Moderate high' };
  }


  // Trending low: in range but falling rapidly toward hypoglycemia
  if (trend !== null && trend < -2) {
    return { id: 5, name: 'trending low', description: 'Rapid downward trend' };
  }

  // Repeated unresolved mild high: was high, still borderline
  if (highCountLastHour >= 3) {
    return { id: 9, name: 'repeated unresolved mild', description: 'Mild high persists' };
  }

  if (isRecovering) {
    return { id: 10, name: 'recovering', description: 'Post-treatment rise' };
  }

  return { id: 11, name: 'in range', description: 'Stable glucose' };
}

