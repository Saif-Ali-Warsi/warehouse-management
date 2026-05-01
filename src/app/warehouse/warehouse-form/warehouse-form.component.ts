import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../../core/services/warehouse.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Warehouse } from '../../core/models/warehouse.model';
import { Subject, from } from 'rxjs';
import { concatMap, exhaustMap, mergeMap, toArray } from 'rxjs/operators';


@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrl: './warehouse-form.component.scss'
})
export class WarehouseFormComponent implements OnInit {

  isEdit = false;
  warehouseId!: string;
  submit$ = new Subject<void>();

  selectedFiles: File[] = [];


  form = new FormGroup({
    name: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    branch: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    contactPerson: new FormControl('', Validators.required)
  });

  constructor(private warehouseService: WarehouseService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');


    if (id) {
      this.isEdit = true;
      this.warehouseId = id;

      this.warehouseService.getWarehouseById(id).subscribe((warehouse) => {
        this.form.patchValue(warehouse)
      })
    }


    this.submit$
      .pipe(
        exhaustMap(() => {
          const formValue = this.form.value;

          const warehouseData: Warehouse = {
            id: this.isEdit
              ? this.warehouseId
              : Date.now().toString(),

            name: formValue.name || '',
            location: formValue.location || '',
            branch: formValue.branch || '',
            status: formValue.status || '',
            contactPerson: formValue.contactPerson || ''
          };


          const apiCall = this.isEdit
            ? this.warehouseService.updateWarehouse(this.warehouseId, warehouseData)
            : this.warehouseService.addWarehouse(warehouseData);

          return apiCall.pipe(
            concatMap(() => {
              console.log('Warehouse API completed');
              return this.warehouseService.logActivity({
                action: this.isEdit ? 'UPDATE' : 'CREATE',
                warehouseName: warehouseData.name
              })
            }),
            concatMap(() => {
              if (!this.selectedFiles.length) {
                return from([null]);
              }
              return from(this.selectedFiles).pipe(
                mergeMap((file) => {
                  return this.warehouseService.uploadFile(file);
                }),
                toArray()
              )
            })
          )


        })
      )
      .subscribe(() => {
        this.router.navigate(['/warehouses']);
      });

  }

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }
    this.submit$.next();
  }


}
