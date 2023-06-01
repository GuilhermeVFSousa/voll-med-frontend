export type PacienteDetails = {

    id: number | undefined;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    endereco: {
      logradouro: string;
      bairro: string;
      cep: string;
      numero: string;
      complemento: string;
      cidade: string;
      uf: string;
    }


}
