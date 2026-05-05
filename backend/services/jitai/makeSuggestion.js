const NOTIFICATION_TYPE = {
  INTERRUPTIVE: 'interruptive',   // P0, P1  critical, always wake
  INFORMATIVE: 'informative',     // P2, P3  non-critical
  PASSIVE: 'passive',             // P4 encouragement
};

const PROTOCOLS = {
  rule1515: 'Fast carbs. Recheck in 15m. Repeat if low.',
  glucagon: 'If unresponsive: Give glucagon and call emergency.',
  hyperglycemiaCorrection: 'Correct insulin and hydrate. Recheck in 2h.',
  ketoneCheck: 'Check ketones. If positive, call doctor. Hydrate and bolus.',
  monitor: 'Monitor closely for trends.',
};

const DECISION_MATRIX = {
  1: {
    priority: 'P0',
    notificationType: NOTIFICATION_TYPE.INTERRUPTIVE,
    action: 'URGENT: 25g fast carbs. Glucagon if unresponsive.',
    followUp: 'Call 911 if no improvement in 15m or unconscious.',
    escalate: true,
  },
  2: {
    priority: 'P1',
    notificationType: NOTIFICATION_TYPE.INTERRUPTIVE,
    action: PROTOCOLS.rule1515,
    followUp: 'Once >70, consider protein snack to prevent drop.',
    escalate: false,
  },
  3: {
    priority: 'P1',
    notificationType: NOTIFICATION_TYPE.INTERRUPTIVE,
    action: PROTOCOLS.rule1515,
    followUp: 'Recheck 15m. Repeat carbs if still <70.',
    escalate: false,
  },
  4: {
    priority: 'P1',
    notificationType: NOTIFICATION_TYPE.INTERRUPTIVE,
    action: `Persistent low. ${PROTOCOLS.rule1515} ${PROTOCOLS.glucagon}`,
    followUp: 'Contact doctor. Insulin adjustment may be needed.',
    escalate: true,
  },
  5: {
    priority: 'P4',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: 'Fast drop: Carbs now to prevent low.',
    followUp: 'Recheck 15m to confirm stabilization.',
    escalate: false,
  },
  6: {
    priority: 'P2',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: PROTOCOLS.ketoneCheck,
    followUp: 'Bolus & hydrate. Recheck 2h.',
    escalate: false,
  },
  7: {
    priority: 'P3',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: 'Mild high. Administer conservative correction.',
    followUp: 'Hydrate. Recheck 2h.',
    escalate: false,
  },
  8: {
    priority: 'P2',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: `Persistent high. ${PROTOCOLS.ketoneCheck}`,
    followUp: 'Contact doctor if ketones present or no improvement.',
    escalate: true,
  },
  9: {
    priority: 'P3',
    notificationType: NOTIFICATION_TYPE.INFORMATIVE,
    action: 'Extended high. Consider correction dose.',
    followUp: "Contact doctor if BG doesn't fall within 2h.",
    escalate: false,
  },
  10: {
    priority: 'P4',
    notificationType: NOTIFICATION_TYPE.PASSIVE,
    action: 'Recovering. Stop carbs to prevent rebound.',
    followUp: 'Monitor to ensure BG stays in range.',
    escalate: false,
  },
  11: {
    priority: 'P4',
    notificationType: NOTIFICATION_TYPE.PASSIVE,
    action: 'In range. Good work!',
    followUp: null,
    escalate: false,
  },
};

function makeSuggestion(event, glucose, trend) {
  const entry = DECISION_MATRIX[event.id];
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
