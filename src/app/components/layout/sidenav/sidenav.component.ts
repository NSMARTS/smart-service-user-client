import { Component } from '@angular/core';
import { SidenavItemComponent } from '../sidenav-item/sidenav-item.component';

@Component({
  selector: 'sidenav',
  standalone: true,
  imports: [
    SidenavItemComponent
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss','../../../../styles.scss']
})
export class SidenavComponent {
  navItems: any;

  constructor() {
    
  }
}
