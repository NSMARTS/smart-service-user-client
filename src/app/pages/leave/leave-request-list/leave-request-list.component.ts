import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';

@Component({
  selector: 'app-leave-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.scss']
})
export class LeaveRequestListComponent {

}
