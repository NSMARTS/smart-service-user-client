import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit{
  meetings: any = [];
  constructor(private employeeService: EmployeeService, private profileSerivce: ProfileService) {}
  ngOnInit(): void {
    
    this.employeeService.meetingList().subscribe((res: any)=> {
      this.meetings = res;
    })
  }
}
