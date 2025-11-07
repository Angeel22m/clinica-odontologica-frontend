// src/services/authService.ts
const BASE_URL = "http://localhost:3000";

export interface LoginResponse {
  code: number;
  message: string;
  token?: string;
  user?: any;
}

export interface SignupPayload {
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  fechaNac?: string;
  correo: string;
  password: string;
}

/**
 * LOGIN
 * Tipado estricto porque siempre devuelve la misma estructura
 */
export async function login(correo: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, password }),
  });

  if (!res.ok) {
    return { code: res.status, message: "Error en la solicitud" };
  }

  return await res.json();
}

/**
 * SIGNUP
 * Puede devolver:
 *  ✅ { code: 10, message: "Usuario creado" }
 *  ❌ { statusCode: 400, message: [ "error1", "error2" ] }
 * Por eso NO se tipa como LoginResponse
 */
export async function signup(data: SignupPayload): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => null);

    // Si la API devolvió error 4xx, retornamos JSON del error
    if (!res.ok) return json;

    return json;
  } catch (err) {
    console.error("Error en signup:", err);
    return {
      statusCode: 500,
      message: "Error de conexión con el servidor",
    };
  }
}
