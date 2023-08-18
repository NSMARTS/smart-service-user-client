import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { SidenavService } from 'src/app/stores/layout/sidenav.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule,
    FlexLayoutModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss', '../../../../styles.scss']
})
export class ToolbarComponent {
  constructor(private sidenavService: SidenavService) {}
  openSidenav() {
    this.sidenavService.openSidenav()
  }
}
