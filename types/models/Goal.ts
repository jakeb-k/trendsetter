export default interface Goal {
    id: number, 
    user_id: number, 
    title: string, 
    description: string,
    category: string, 
    status: string, 
    start_date: Date,
    end_date: Date,
    events?: Event[], 
}