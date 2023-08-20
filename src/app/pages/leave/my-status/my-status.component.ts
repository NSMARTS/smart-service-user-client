import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';

@Component({
  selector: 'app-my-status',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './my-status.component.html',
  styleUrls: ['./my-status.component.scss']
})
export class MyStatusComponent {

}
