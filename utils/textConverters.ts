
export function emojiConverter(text: string): string {
    const emojiMap: Record<string, string> = {
        'happy': '😄',
        'frustrated': '😩',
        'meh': '😐'
    }

    return emojiMap[text] || text;
}

export function statusConverter(status: string): string[] {
    const statusIconMap: Record<string, [string, string]> = {
        completed: ['checkcircle', '#4ade80'],     // green-400
        skipped: ['closecircle', '#f87171'],       // red-400
        partial: ['exclamationcircle', '#ffbf00'], // orange-400
        struggled: ['minuscircle','#fb923c'],      // gray-400
        nailed_it: ['star', '#facc15'],            // yellow-400 (for gold)
    };
    return statusIconMap[status] || status;
}