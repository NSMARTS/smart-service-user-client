import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  info: any;
  isStatusLoading = true;
  constructor(private dashboardService: DashboardService) { }
  ngOnInit(): void {
    this.dashboardService.employeeDashboard().subscribe((res) => {
      this.info = res;
      this.isStatusLoading = false;
    })
  }
}
