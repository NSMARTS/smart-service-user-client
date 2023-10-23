import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnInit {
  meetings: any = [];

  leaveLoadingStatus: boolean = true;
  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.getTokenInfo().isManager) {
      this.employeeService.managerMeetingList().subscribe((res: any) => {
        this.meetings = res;
        this.leaveLoadingStatus = false;
      });
    } else {
      this.employeeService.meetingList().subscribe((res: any) => {
        this.meetings = res;
        this.leaveLoadingStatus = false;
      });
    }
  }
  enterMeeting(data: any) {
    let meetingLink = data.meetingLink;
    if (meetingLink != null) {
      if (
        meetingLink.indexOf('http://') !== 0 &&
        meetingLink.indexOf('https://') !== 0
      ) {
        meetingLink = 'http://' + meetingLink;
      }
    }
    window.open(meetingLink);
  }
}
