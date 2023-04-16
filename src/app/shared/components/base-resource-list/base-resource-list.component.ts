import { OnInit } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor( protected resourceService: BaseResourceService<T> ) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      resources => this.resources = resources.sort((a, b) => b.id - a.id),
      error => {
        alert('Loading list error');
        console.log(error);
      }
    );
  }

  deleteResource(resource: T) {
    const mustDelete = confirm(`Do you want delete the register`);

    if (mustDelete) {
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element !== resource),
        () => alert('Trying delete error')
      );
    }
  }

}
