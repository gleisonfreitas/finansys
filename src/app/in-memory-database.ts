import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {

    const categories: Category[] = [
      { id: 1, name: 'Moradia', description: 'Pagamento de contas de casa'},
      { id: 2, name: 'Saúde', description: 'Plano de saúde e remédios'},
      { id: 3, name: 'Lazer', description: 'Cinema, parque, praias, etc'},
      { id: 4, name: 'Salário', description: 'Recebimento de salário'},
      { id: 5, name: 'Freelas', description: 'Trabalhos como freelancer'}
    ];

    const entries: Entry[] = [
      // tslint:disable-next-line:max-line-length
      { id: 1, name: 'Energy', categoryId: categories[0].id, category: categories[0], paid: true, date: '10/20/2018', amount: '70.00', type: 'expense', description: 'energy bill'} as Entry,
      // tslint:disable-next-line:max-line-length
      { id: 2, name: 'Water', categoryId: categories[0].id, category: categories[0], paid: false, date: '05/23/2018', amount: '30.00', type: 'revenue', description: 'water bill'} as Entry
    ];

    return { categories, entries };
  }
}
