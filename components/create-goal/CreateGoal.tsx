import { View } from "react-native";
import CreateGoalForm from "./CreateGoalForm";
import CreateGoalHeader from "./CreateGoalHeader";

export default function CreateGoal() {
    return (
        <>
            <CreateGoalHeader />
            <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
            <CreateGoalForm />
        </>
    );
}
