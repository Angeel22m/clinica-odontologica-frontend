import type { Persona } from "./Persona";
import type { User } from "./User";

export type Paciente = {
  persona: Persona;
  user: User | null; // null solo mientras se crea, ya confirmamos que todo paciente debe tener user
};
