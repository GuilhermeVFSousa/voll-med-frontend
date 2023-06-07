export type MedicoDetails = {

    id: number | undefined;
    nome: string;
    email?: string;
    crm: string;
    telefone: string
    especialidade: string
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
