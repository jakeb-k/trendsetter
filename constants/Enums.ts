export const Moods: Record<string, string> = {
    happy: '😄',
    good: '😊',
    meh: '😐',
    frustrated: '😩',
};

export const Statuses: Record<string, [string, string]> = {
    completed: ['checkcircle', '#4ade80'], // green-400
    skipped: ['closecircle', '#f87171'], // red-400
    partial: ['exclamationcircle', '#ffbf00'], // orange-400
    struggled: ['minuscircle', '#fb923c'], // gray-400
    nailed_it: ['star', '#facc15'], // yellow-400 (for gold)
};
