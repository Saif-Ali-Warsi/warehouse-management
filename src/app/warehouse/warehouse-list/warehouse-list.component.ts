import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../core/services/warehouse.service';
import { Warehouse } from '../../core/models/warehouse.model';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { LoaderService } from '../../core/services/loader.service';
import { ConfirmModalComponent } from "../../shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss'
})
export class WarehouseListComponent implements OnInit {

  showDeleteModal = false;
  selectedWarehouseId = '';

  warehouses: Warehouse[] = [];

  search$ = new Subject<string>();

  constructor(private warehouseService: WarehouseService, public loader: LoaderService) { }


  ngOnInit() {
    this.loadWarehouses();

    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm) => {
        return this.warehouseService.getWarehouses().pipe(
          map((warehouses) => {
            if (!searchTerm) {
              return warehouses;
            }

            return warehouses.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()))
          })
        )
      })
    ).subscribe((data) => {
      this.warehouses = data;
    })
  }

  onSearch(event: any) {
    const value = event.target.value;
    this.search$.next(value);
  }


  loadWarehouses() {
    this.warehouseService.getWarehouses().subscribe((data => {
      this.warehouses = data;
    }))
  }


  deleteWarehouse(id: string) {
    this.selectedWarehouseId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.warehouseService.deleteWarehouse(this.selectedWarehouseId).subscribe(() => {
      this.loadWarehouses();
      this.closeModal();
    })
  }

  closeModal() {
    this.showDeleteModal = false;
    this.selectedWarehouseId = '';
  }

  trackByWarehouseId(index: number, warehouse: Warehouse): string {
    return warehouse.id
  }
}
