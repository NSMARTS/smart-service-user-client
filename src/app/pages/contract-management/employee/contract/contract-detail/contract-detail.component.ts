import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PdfService } from 'src/app/services/pdf/pdf.service';
import { BoardSlideComponent } from '../../../white-board/board-slide/board-slide.component';
import { BoardNavComponent } from '../../../white-board/board-nav/board-nav.component';
import { BoardFabsComponent } from '../../../white-board/board-fabs/board-fabs.component';
import { BoardCanvasComponent } from '../../../white-board/board-canvas/board-canvas.component';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [
    CommonModule,
    BoardCanvasComponent,
    BoardFabsComponent,
    BoardNavComponent,
    BoardSlideComponent
  ],
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss']
})
export class ContractDetailComponent {
  route = inject(ActivatedRoute)
  pdfService = inject(PdfService)
}
