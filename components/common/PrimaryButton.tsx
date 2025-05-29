import { ReactNode } from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';


type PrimaryButtonProps = {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function PrimaryButton({children, onPress}: PrimaryButtonProps) {
    return (
        <TouchableOpacity
            className="bg-orange-500 px-4 py-2 rounded-lg shadow-md shadow-orange-500/50 active:scale-95 transition-transform duration-200"
            activeOpacity={0.7}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
}
