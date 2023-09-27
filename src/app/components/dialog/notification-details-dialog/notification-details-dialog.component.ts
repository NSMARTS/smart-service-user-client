import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuillModule, QuillViewComponent } from 'ngx-quill';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-notification-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    QuillModule
  ],
  templateUrl: './notification-details-dialog.component.html',
  styleUrls: ['./notification-details-dialog.component.scss', '../../../../../node_modules/quill/dist/quill.snow.css']
})
export class NotificationDetailsDialogComponent implements OnInit {
  contents: string = '';
  @ViewChild('quillViewer') quillViewer!: QuillViewComponent;

  constructor(
    public dialogRef: MatDialogRef<NotificationDetailsDialogComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.notificationService.notificationContents(this.data['_id']).subscribe((res: any) => {
      this.contents = res.contents;
    })
  }
}
