type DayKey = string; // e.g. "2026-01-10"

export function computeStreak(
    actualDays: DayKey[],
    expectedDays: DayKey[],
): number {
    if (expectedDays.length === 0) return 0;

    const actualSet = new Set(actualDays);

    let streak = 0;

    // walk backwards from the most recent expected day
    for (let i = expectedDays.length - 1; i >= 0; i--) {
        const day = expectedDays[i];

        if (actualSet.has(day)) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}
