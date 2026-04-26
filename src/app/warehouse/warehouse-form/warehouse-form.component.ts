import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validator, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../../core/services/warehouse.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Warehouse } from '../../core/models/warehouse.model';


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
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }

    const formValue = this.form.value;

    const warehouseData: Warehouse = {
      id: this.isEdit ? this.warehouseId : Date.now().toString(),
      name: formValue.name || '',
      location: formValue.location || '',
      branch: formValue.branch || '',
      status: formValue.status || '',
      contactPerson: formValue.contactPerson || ''
    };

    if (this.isEdit) {
      this.warehouseService.updateWarehouse(this.warehouseId, warehouseData).subscribe(() => {
        this.router.navigate(['/warehouses']);
      });
    } else {
      this.warehouseService.addWarehouse(warehouseData).subscribe(() => {
        this.router.navigate(['/warehouses']);
      })
    }
  }


}
