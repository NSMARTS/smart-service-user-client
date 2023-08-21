import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';

@Component({
  selector: 'app-employee-rd-request',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './employee-rd-request.component.html',
  styleUrls: ['./employee-rd-request.component.scss']
})
export class EmployeeRdRequestComponent {

}
