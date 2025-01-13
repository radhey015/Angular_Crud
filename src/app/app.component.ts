import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { employeeModel } from './model/employee';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular_Crud';

  employeeForm: FormGroup = new FormGroup({});
  employeeObj: employeeModel = new employeeModel();
  employeeList: employeeModel[] = [];

  url: string=environment.apiBaseUrl+'/Employee/';

  constructor(private http: HttpClient) {
     debugger;
    // this.refreshList();
    this.createForm();
    const oldData = localStorage.getItem("EmpData");
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  refreshList(){
    
    this.http.get(this.url)
    .subscribe({
      next:res=>{
        console.log(res);
       // this.employeeList=res as employeeModel []; 
      },
      error:err=>{console.log(err)}
    })
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name, [Validators.required]),
      city: new FormControl(this.employeeObj.city),
      state: new FormControl(this.employeeObj.state),
      emailId: new FormControl(this.employeeObj.emailId),
      contactNo: new FormControl(this.employeeObj.contactNo),
      address: new FormControl(this.employeeObj.address),
      pinCode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.minLength(6)]),
    })

  }

  onReset() {
    this.employeeObj = new employeeModel();
    this.createForm();
  }
  onSave() {
   // debugger;
    const oldData = localStorage.getItem("EmpData");
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls["empId"].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    }
    else {
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.onReset();
  }

  onEdit(item: employeeModel) {
    this.employeeObj = item;
    this.createForm();
  }

  onUpdate() {
    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empId'].value);
    if (record != undefined) {
      record.name = this.employeeForm.controls['name'].value;
      record.emailId = this.employeeForm.controls['emailId'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
      record.address = this.employeeForm.controls['address'].value;
    }

    localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
    this.onReset();
  }

  onDelete(id: number) {
    const isDelete = confirm("Are you sure want to delete.");
    if (isDelete) {
      const index = this.employeeList.findIndex(m => m.empId == id);
      this.employeeList.splice(index, 1);
    }
    localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
  }
}
