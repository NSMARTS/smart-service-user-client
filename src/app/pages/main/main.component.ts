import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmployeeDashboardComponent } from 'src/app/components/dashboard/employee-dashboard/employee-dashboard.component';
import { ManagerDashboardComponent } from 'src/app/components/dashboard/manager-dashboard/manager-dashboard.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ManagerDashboardComponent, EmployeeDashboardComponent, CommonModule, MaterialsModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  isManager: any;
  constructor(private authService: AuthService,) {

  }
  ngOnInit(): void {
    this.isManager = this.authService.getTokenInfo().isManager
  }
}
