import { useState } from 'react';
import { View } from 'react-native';
import CreateGoalForm from './CreateGoalForm';
import CreateGoalHeader from './CreateGoalHeader';

export default function CreateGoal() {
    const [stage, setStage] = useState(0);
    return (
        <>
            {stage === 0 ? (
                <>
                    <CreateGoalHeader />
                    <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
                    <CreateGoalForm setSuccess={() => setStage(1)} />
                </>
            ) : (
                <>
                    <CreateGoalHeader />
                    <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
                    <CreateGoalForm setSuccess={() => setStage(1)} />
                </>
            )}
        </>
    );
}
