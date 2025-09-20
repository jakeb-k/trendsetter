import { Moods, Statuses } from "@/constants/Enums";

export function emojiConverter(text: string): string {
    return Moods[text] || text;
}

export function statusConverter(status: string): string[] {

    return Statuses[status] || status;
}