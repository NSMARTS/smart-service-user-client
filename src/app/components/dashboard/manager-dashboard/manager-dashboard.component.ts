import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  info: any;
  isStatusLoading = true;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.managerDashboard().subscribe((res: any) => {
      this.info = res;
      this.isStatusLoading = false;
    })
  }
}
