import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent {

}