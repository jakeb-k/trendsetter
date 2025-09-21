export interface EventFeedbackRequest {
    mood: string
    status:string    
    note: string
}

export interface EventRequest {
    goal_id?: number,
    title: string,
    description: string, 
    frequency: 'weekly' | 'monthly',
    times_per_week: number,
    duration_in_weeks: number,
    start_date: Date, 
}