import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCanvasComponent } from '../../../white-board/board-canvas/board-canvas.component';
import { BoardFabsComponent } from '../../../white-board/board-fabs/board-fabs.component';
import { BoardNavComponent } from '../../../white-board/board-nav/board-nav.component';
import { BoardSlideComponent } from '../../../white-board/board-slide/board-slide.component';
import { ActivatedRoute } from '@angular/router';
import { PdfService } from 'src/app/services/pdf/pdf.service';

@Component({
  selector: 'app-manager-contract-detail',
  standalone: true,
  imports: [
    CommonModule,
    BoardCanvasComponent,
    BoardFabsComponent,
    BoardNavComponent,
    BoardSlideComponent
  ],
  templateUrl: './manager-contract-detail.component.html',
  styleUrls: ['./manager-contract-detail.component.scss']
})
export class ManagerContractDetailComponent {
  route = inject(ActivatedRoute)
  pdfService = inject(PdfService)

}
