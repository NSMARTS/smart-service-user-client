import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';

@Component({
  selector: 'app-rd-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './rd-request-list.component.html',
  styleUrls: ['./rd-request-list.component.scss']
})
export class RdRequestListComponent {

}
