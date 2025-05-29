import Message from "../models/Message";

export interface AiChatRequest {
    goal_description: string; 
    context?: Message[];
}