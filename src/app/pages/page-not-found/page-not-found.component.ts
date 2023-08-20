import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

}
