export type MedicoCreate = {

    nome: string;
    email: string;
    crm: string;
    especialidade: string;
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
