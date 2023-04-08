import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { CategoryService } from './../../categories/shared/category.service';
import { Category } from './../../categories/shared/category.model';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  entry: Entry = new Entry();
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
    private entryService: EntryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
   }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
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

  // PRIVATE METHODS

  private setCurrentAction() {
    if ( this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
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

  private loadEntry() {
    if ( this.currentAction === 'edit' ) {

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        (error) => alert('Error on serve, try later again')
      );
    }
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  private setPageTitle() {
    if ( this.currentAction === 'new') {
      this.pageTitle = 'New Entry';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = `Editing The Entry: ${entryName}`;
    }
  }

  private createEntry() {
    const entry = Object.assign( new Entry(), this.entryForm.value);

    this.entryService.create(entry)
      .subscribe(
        entryCreated => this.actionsForSuccess(entryCreated),
        error => this.actionsForError(error)
    );
  }

  private updateEntry() {
    const entry = Object.assign( new Entry(), this.entryForm.value);

    this.entryService.update(entry)
      .subscribe(
        entryUpdated => this.actionsForSuccess(entryUpdated),
        error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(entry: Entry) {
    toastr.success('Success operation.');

    // redirect/reload component page
    this.router.navigateByUrl('entries', {skipLocationChange: true})
      .then(
        () => this.router.navigate(['entries', entry.id])
      );
  }

  private actionsForError(error) {
    toastr.error('Error trying save the entry');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['There is a communication failure to server.'];
    }
  }



}
