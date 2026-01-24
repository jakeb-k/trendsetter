import { useState } from 'react';
import { View } from 'react-native';
import FormHeader from '../common/FormHeader';
import CreateGoalForm from './CreateGoalForm';

export default function CreateGoal() {
    const [stage, setStage] = useState(0);
    return (
        <>
            {stage === 0 ? (
                <>
                    <FormHeader title="Set a Goal" subtitle="Make it real. No vague targets." />
                    <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
                    <CreateGoalForm setSuccess={() => setStage(1)} />
                </>
            ) : (
                <>
                    <FormHeader title="Add an Event" subtitle="What are you going to do to reach your goal?"  />
                    <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
                    <CreateGoalForm setSuccess={() => setStage(1)} />
                </>
            )}
        </>
    );
}
