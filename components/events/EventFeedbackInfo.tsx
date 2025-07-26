import EventFeedback from "@/types/models/EventFeedback";
import AntDesign from '@expo/vector-icons/AntDesign';
import moment from "moment";
import { Text, View } from "react-native";

export default function EventFeedbackInfo(eventFeedback?: EventFeedback) {
    //@TODO - should have sliding actions (edit and delete) on event feedback but only for the current date
    return (
        <View className="pl-4 my-4 border-2 border-primary shadow-lg shadow-primary rounded-lg p-2 relative">
            <View className='absolute top-2 right-4 flex flex-row items-center space-x-2'>
                <Text className='text-xl'>😄</Text>
                <AntDesign name="checkcircle" size={20} color="white" />
            </View>
            <Text className="text-lg font-satoshi text-white mb-2">
                {moment().format('ddd Do MMM')}
            </Text>
            <Text className="tracking-wider font-satoshi_italic mb-4 text-white text-left">
                Worked on putting alignment for 30 minutes and felt pretty good on the greens today
            </Text>
        </View>
    )
}