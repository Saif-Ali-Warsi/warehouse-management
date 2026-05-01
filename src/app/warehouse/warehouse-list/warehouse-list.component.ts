import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../core/services/warehouse.service';
import { Warehouse } from '../../core/models/warehouse.model';
import { RouterLink } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, takeUntil } from 'rxjs/operators';
import { LoaderService } from '../../core/services/loader.service';
import { ConfirmModalComponent } from "../../shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss'
})
export class WarehouseListComponent implements OnInit, OnDestroy {

  showDeleteModal = false;
  selectedWarehouseId = '';

  warehouses: Warehouse[] = [];

  search$ = new Subject<string>();

  private destroy$ = new Subject<void>();

  constructor(private warehouseService: WarehouseService, public loader: LoaderService) { }


  ngOnInit() {
    this.loadWarehouses();

    interval(1500).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.shuffleWarehouses();
    })

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
          }),
          takeUntil(this.destroy$)
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
    this.warehouseService.getWarehouses().pipe(takeUntil(this.destroy$)).subscribe(data => this.warehouses = data);
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

  shuffleWarehouses() {
    const shuffled = [...this.warehouses];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    this.warehouses = shuffled;
  }

  trackByWarehouseId(index: number, warehouse: Warehouse): string {
    return warehouse.id
  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
