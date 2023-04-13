import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

import { EntryService } from '../shared/entry.service';

import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { CategoryService } from './../../categories/shared/category.service';

import { Category } from './../../categories/shared/category.model';
import { Entry } from '../shared/entry.model';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  categories: Category[] = [];

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '.',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new Entry(), entryService, Entry.getInstanceFromJson);
   }

  ngOnInit() {
    this.loadCategories();
    super.ngOnInit();
   }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text,
          value
        };
    });
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  protected createPageTitle(): string {
    return 'New Entry';
  }

  protected editingPageTitle(): string {
    const entryName = this.resource.name || '';

    return `Editing entry: ${entryName}`;
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }
}
