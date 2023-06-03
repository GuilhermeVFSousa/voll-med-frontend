export type Consulta = {
  id: number,
  medico: {
    nome: string,
    crm: string,
    especialidade: string
  };
  paciente: {
    nome: string,
    cpf: string,
  };
  data: Date;
  data_termino: Date;
}
