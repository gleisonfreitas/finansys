import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResource: ( jsonData ) => T

  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder =  this.injector.get(FormBuilder);
   }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
   }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createResource();
    } else {
      this.updateResource();
    }

  }

  // PROTECTED METHODS

  protected setCurrentAction() {
    if ( this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  protected abstract buildResourceForm(): void;

  protected loadResource() {
    if ( this.currentAction === 'edit' ) {

      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      )
      .subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource);
        },
        (error) => alert('Error on serve, try later again')
      );
    }
  }

  protected setPageTitle() {
    if ( this.currentAction === 'new') {
      this.pageTitle = this.createPageTitle();
    } else {
      this.pageTitle = this.editingPageTitle();
    }
  }

  protected createPageTitle(): string {
    return 'New';
  }

  protected editingPageTitle(): string {
    return 'Editing';
  }

  protected createResource() {
    const resource: T = this.jsonDataToResource(this.resourceForm.value);

    this.resourceService.create(resource)
      .subscribe(
        resourceCreated => this.actionsForSuccess(resourceCreated),
        error => this.actionsForError(error)
    );
  }

  private updateResource() {
    const resource: T = this.jsonDataToResource(this.resourceForm.value);

    this.resourceService.update(resource)
      .subscribe(
        resourceUpdated => this.actionsForSuccess(resourceUpdated),
        error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(resource: T) {
    toastr.success('Success operation.');

    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    // redirect/reload component page
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true})
      .then(
        () => this.router.navigate([baseComponentPath, resource.id])
      );
  }

  private actionsForError(error) {
    toastr.error('Error trying save the resource');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['There is a communication failure to server.'];
    }
  }

}
