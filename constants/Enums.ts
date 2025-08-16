import MehIcon from '@/assets/icons/emoji-quite.svg';
import FrustratedIcon from '@/assets/icons/emoji-sad.svg';
import GoodIcon from '@/assets/icons/emoji-smile.svg';
import HappyIcon from '@/assets/icons/emoji-talking-happy.svg';

import CompletedIcon from '@/assets/icons/check-circle.svg';
import PartialIcon from '@/assets/icons/minus-circle.svg';
import NailedItIcon from '@/assets/icons/star.svg';
import StruggledIcon from '@/assets/icons/warning-circle.svg';
import SkippedIcon from '@/assets/icons/xmark-circle.svg';

import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

export const Moods: Record<string, string> = {
    happy: '😄',
    good: '😊',
    meh: '😐',
    frustrated: '😩',
};

export const MoodOptions: Record<string, FC<SvgProps>> = {
    frustrated: FrustratedIcon,
    meh: MehIcon,
    good: GoodIcon,
    happy: HappyIcon,
};

export const Statuses: Record<string, [string, string]> = {
    completed: ['checkcircle', '#4ade80'], // green-400
    skipped: ['closecircle', '#f87171'], // red-400
    partial: ['exclamationcircle', '#ffbf00'], // orange-400
    struggled: ['minuscircle', '#fb923c'], // gray-400
    nailed_it: ['star', '#facc15'], // yellow-400 (for gold)
};

export const StatusOptions: Record<string, FC<SvgProps>> = {
    completed: CompletedIcon,
    skipped: SkippedIcon,
    partial: PartialIcon,
    struggled: StruggledIcon,
    nailed_it: NailedItIcon
};
