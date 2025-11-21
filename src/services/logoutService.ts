import api from "../utils/api";
import {AxiosError} from "axios";

export const logoutService = async (empleadoId: number): Promise<void> => {
    try {
        await api.post(`/logs/logout/${empleadoId}`);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(
                "Error during logout:",
                error.response?.data || error.message
            );
        }

    }
}
