import Goal from '@/types/models/Goal';
import { useState } from 'react';
import { View } from 'react-native';
import FormHeader from '../common/FormHeader';
import GoalEventForm from '../events/GoalEventForm';
import CreateGoalForm from './CreateGoalForm';

export default function CreateGoal() {
    const [stage, setStage] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newGoal, setNewGoal] = useState<Goal>({} as Goal);

    return (
        <>
            {stage === 0 ? (
                <>
                    <FormHeader
                        title="Set a Goal"
                        subtitle="Make it real. No vague targets."
                    />
                    <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
                    <CreateGoalForm setSuccess={() => setStage(1)} />
                </>
            ) : (
                <View className="pb-32">
                    <FormHeader
                        title="Add an Event"
                        subtitle="What are you going to do to reach your goal?"
                    />
                    <View className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF7700]/70 to-transparent" />
                    <GoalEventForm
                        resetSubmitting={() => setIsSubmitting(false)}
                        isSubmitting={isSubmitting}
                        setSuccess={() => setStage(2)}
                        newGoalID={4}
                    />
                </View>
            )}
        </>
    );
}
