import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../core/services/warehouse.service';
import { Warehouse } from '../../core/models/warehouse.model';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss'
})
export class WarehouseListComponent implements OnInit {

  warehouses: Warehouse[] = [];

  search$ = new Subject<string>();

  constructor(private warehouseService: WarehouseService) { }


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
    const confirmDelete = confirm('Are you sure you want to delete this warehouse?')

    if (confirmDelete) {
      this.warehouseService.deleteWarehouse(id).subscribe(() => {
        this.loadWarehouses();
      })
    }
  }
}
