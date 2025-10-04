import Config from "@/constants/Config";
import RegisterRequest, { LoginRequest } from "@/types/requests/AuthRequest";
import axios from "axios";

export async function sendLoginRequest(payload: LoginRequest) {
  try {
    const res = await axios.post(`${Config.API_URL}/auth/login`, payload);
    return res.data;
  } catch (err) {
    console.error('Login request failed:', err);
    throw err
  }
}

export async function sendRegisterRequest(payload: RegisterRequest){
    try {
        const res = await axios.post(`${Config.API_URL}/auth/register`, payload);
        return res.data;
    } catch (err) {
        console.error('Register request failed:', err);
        return {error: true, message:err}
    }
}