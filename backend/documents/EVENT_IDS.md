# Event Reference IDs

All events returned by `classifyEvent()` in [classifyEvent.js](classifyEvent.js).

| ID | Name | Description | Trigger Condition |
|----|------|-------------|-------------------|
| 1 | critical low | Severe hypoglycemia | glucose < 54 |
| 2 | nocturnal low | Overnight low | glucose 54–70 AND isNocturnal |
| 3 | standard low | General low event | glucose 54–70 |
| 4 | repeated unresolved low | Still low after alerts | glucose 54–70 AND lowCountLastHour >= 3 |
| 5 | trending low | Rapid downward trend | glucose in range AND trend < -2 |
| 6 | severe high | Severe hyperglycemia | glucose >= 250 |
| 7 | mild high | Moderate high | glucose 180–249 |
| 8 | repeated unresolved high | Persistently high | glucose 180–249 AND highCountLastHour >= 3 |
| 9 | repeated unresolved mild | Mild high persists | glucose in range AND highCountLastHour >= 3 |
| 10 | recovering | Post-treatment rise | glucose in range AND isRecovering |
| 11 | in range | Stable glucose | All other cases |
