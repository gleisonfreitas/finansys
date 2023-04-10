import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Category> {

  protected apiPath = 'api/categories';

  constructor(protected injector: Injector) {
    super('api/categories', injector, Category.getInstanceFromJson);
   }
}
