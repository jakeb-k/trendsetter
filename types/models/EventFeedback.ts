export default interface EventFeedback {
    id: number; 
    event_id: number;
    user_id: number;
    note: string;
    status: 'completed' | 'skipped' | 'partial' | 'struggled' | 'nailed_it'; 
    mood: string; 
    created_at: Date;
    
}