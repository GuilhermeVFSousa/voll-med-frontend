export type ConsultaCreate = {
  idPaciente: number;
  idMedico?: number;
  data: string;
  duracao: number;
  especialidade: string | null;
}
