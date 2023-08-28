import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialsModule } from 'src/app/materials/materials.module';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    MaterialsModule,
    RouterModule,
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

}
