import Config from "@/constants/Config";
import { LoginRequest } from "@/types/requests/Auth";
import axios from "axios";

export async function sendLoginRequest(payload: LoginRequest) {
  try {
    const res = await axios.post(`${Config.API_URL}/auth/login`, payload);
    return res.data;
  } catch (err) {
    console.error('Login request failed:', err);
    return {error: true, message:err}
  }
}