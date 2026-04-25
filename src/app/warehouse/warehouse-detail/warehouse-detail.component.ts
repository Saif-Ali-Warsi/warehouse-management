import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WarehouseService } from '../../core/services/warehouse.service';
import { Warehouse } from '../../core/models/warehouse.model';

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './warehouse-detail.component.html',
  styleUrl: './warehouse-detail.component.scss'
})
export class WarehouseDetailComponent implements OnInit {

  warehouse!: Warehouse

  constructor(private route: ActivatedRoute, private warehouseService: WarehouseService) { }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.warehouseService.getWarehouseById(id).subscribe((data) => {
      this.warehouse = data;
    })
  }

}
