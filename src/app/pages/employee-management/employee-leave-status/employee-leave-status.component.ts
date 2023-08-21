import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';

@Component({
  selector: 'app-employee-leave-status',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './employee-leave-status.component.html',
  styleUrls: ['./employee-leave-status.component.scss']
})
export class EmployeeLeaveStatusComponent {

}
