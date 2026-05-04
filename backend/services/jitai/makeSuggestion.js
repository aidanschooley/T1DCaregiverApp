
const NOTIFICATION_TYPE = {
  INTERRUPTIVE: 'interruptive',   // P0, P1  critical, always wake
  INFORMATIVE: 'informative',     // P2, P3  non-critical
  PASSIVE: 'passive',             // P4 encouragement
};

const PROTOCOLS = {
  rule1515: 'Give 15g of fast-acting carbs (e.g. 4 glucose tablets, 4oz juice). Recheck BG in 15 minutes. Repeat if still below 70.',
  glucagon: 'If patient is unconscious or unable to swallow: administer glucagon immediately and call 911. Do not give food or drink.',
  hyperglycemiaCorrection: 'Administer insulin correction per your doctor\'s sliding scale. Encourage water intake. Recheck BG in 2 hours.',
  ketoneCheck: 'Check for ketones. If moderate/high, contact your doctor immediately. Administer correction insulin and hydrate.',
  monitor: 'Continue monitoring closely.',
};
const DECISION_MATRIX = {
  1: {
    priority: 'P0',
    notificationType: NOTIFICATION_TYPE.INTERRUPTIVE,
    action: PROTOCOLS.glucagon,
    followUp: 'Call 911 if no improvement within 15 minutes or patient is unresponsive.',
    escalate: true,
  },
  2: {
    priority: 'P1',
    notificationType: NOTIFICATION_TYPE.INTERRUPTIVE,
    action: PROTOCOLS.rule1515,
    followUp: 'Stay with patient until BG is above 70. Consider a bedtime snack with protein to prevent recurrence.',
    escalate: false,
  },
  3: {
    priority: 'P1',
    notificationType: NOTIFICATION_TYPE.INTERRUPTIVE,
    action: PROTOCOLS.rule1515,
    followUp: 'Recheck in 15 minutes. If BG does not rise above 70, repeat treatment.',
    escalate: false,
  },
  4: {
    priority: 'P1',
    notificationType: NOTIFICATION_TYPE.INTERRUPTIVE,
    action: `Persistent low detected. ${PROTOCOLS.rule1515} If patient cannot swallow or does not improve: ${PROTOCOLS.glucagon}`,
    followUp: 'Contact your doctor. Repeated unresolved lows may require insulin adjustment.',
    escalate: true,
  },
  5: {
    priority: 'P4',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: 'BG is trending down quickly. Give 15g of fast-acting carbs now to prevent hypoglycemia.',
    followUp: 'Recheck in 15 minutes to confirm BG stabilizes above 70.',
    escalate: false,
  },
  6: {
    priority: 'P2',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: PROTOCOLS.ketoneCheck,
    followUp: PROTOCOLS.hyperglycemiaCorrection + ' Recheck in 2 hours.',
    escalate: false,
  },
  7: {
    priority: 'P3',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: 'BG is mildly elevated. Administer a conservative insulin correction per your doctor\'s guidance.',
    followUp: 'Encourage water intake. Recheck BG in 2 hours.',
    escalate: false,
  },
  8: {
    priority: 'P2',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: `BG remains persistently high. ${PROTOCOLS.ketoneCheck}`,
    followUp: 'If ketones are present or BG does not improve after correction, contact your doctor.',
    escalate: true,
  },
  9: {
    priority: 'P3',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: 'BG has been mildly elevated for an extended period. Consider a correction dose per your doctor\'s sliding scale.',
    followUp: 'Monitor trend. Contact your doctor if BG does not begin to fall within 2 hours.',
    escalate: false,
  },
  10: {
    priority: 'P4',
    notificationType: NOTIFICATION_TYPE.PASSIVE,
    action: 'BG is recovering well. Avoid further treatment to prevent rebound hyperglycemia.',
    followUp: 'Continue monitoring to confirm BG stays in range.',
    escalate: false,
  },
  11: {
    priority: 'P4',
    notificationType: NOTIFICATION_TYPE.PASSIVE,
    action: 'BG is in a healthy range. Great work managing today!',
    followUp: null,
    escalate: false,
  },
};

function makeSuggestion(event, glucose, trend = null) {
  const entry = DECISION_MATRIX[event.id];

  if (!entry) {
    return {
      priority: 'P4',
      notificationType: NOTIFICATION_TYPE.PASSIVE,
      action: 'No specific action required at this time.',
      followUp: PROTOCOLS.monitor,
      escalate: false,
    };
  }

  return {
    eventName: event.name,
    glucose,
    trend,
    priority: entry.priority,
    notificationType: entry.notificationType,
    action: entry.action,
    followUp: entry.followUp,
    escalate: entry.escalate,
  };
}

export { makeSuggestion, DECISION_MATRIX, NOTIFICATION_TYPE };
