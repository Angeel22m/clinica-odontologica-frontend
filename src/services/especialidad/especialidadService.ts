import { AxiosError } from "axios";
import api from "../../utils/api";

const getHeaders = () => ({ authorization: `Bearer ${localStorage.getItem("token")}` });

export class EspecialidadService {
  async list() {
    try {
      const res = await api.get("/especialidad", { headers: getHeaders() });
      return res.data;
    } catch (err) {
      throw err as AxiosError;
    }
  }

  async getById(id: string | number) {
    try {
      const res = await api.get(`/especialidad/${id}`, { headers: getHeaders() });
      return res.data;
    } catch (err) {
      throw err as AxiosError;
    }
  }

  async create(data: { nombre: string; descripcion?: string }) {
    try {
      const res = await api.post("/especialidad", data, { headers: getHeaders() });
      return res.data;
    } catch (err) {
      throw err as AxiosError;
    }
  }

  async update(id: string | number, data: { nombre?: string; descripcion?: string }) {
    try {
      const res = await api.put(`/especialidad/${id}`, data, { headers: getHeaders() });
      return res.data;
    } catch (err) {
      throw err as AxiosError;
    }
  }

  async delete(id: string | number) {
    try {
      const res = await api.delete(`/especialidad/${id}`, { headers: getHeaders() });
      return res.data;
    } catch (err) {
      throw err as AxiosError;
    }
  }
}

export default new EspecialidadService();