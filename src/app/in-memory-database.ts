import { InMemoryDbService } from "angular-in-memory-web-api";

export class InMemoryDatadase implements InMemoryDbService {
  createDb() {

    const categories = [
      { id: 1, name: 'Moradia', description: 'Pagamento de contas de casa'},
      { id: 2, name: 'Saúde', description: 'Plano de saúde e remédios'},
      { id: 3, name: 'Lazer', description: 'Cinema, parque, praias, etc'},
      { id: 4, name: 'Salário', description: 'Recebimento de salário'},
      { id: 5, name: 'Freelas', description: 'Trabalhos como freelancer'}
    ];

    return categories;
  }
}
