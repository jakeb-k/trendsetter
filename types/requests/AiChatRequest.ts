import Message from "../models/Message";

export interface AiChatRequest {
    goalDescription: string; 
    context?: Message[];
}