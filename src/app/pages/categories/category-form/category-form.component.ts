import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

import { CategoryService } from '../shared/category.service';

import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

import { Category } from '../shared/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor( protected categoryService: CategoryService, protected injetor: Injector ) {
    super(injetor, new Category(), categoryService, Category.getInstanceFromJson);
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [[null], [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  protected createPageTitle(): string {
    return 'New Category';
  }

  protected editingPageTitle(): string {
    const categoryName = this.resource.name || '';

    return `Editing category: ${categoryName}`;
  }
}
