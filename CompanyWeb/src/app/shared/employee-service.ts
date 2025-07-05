import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Employee } from './employee.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeesUrl: string = environment.apiBaseUrl + '/Employees';
  list: Employee[] = [];
  constructor(public http: HttpClient) {}

  refreshList() {
    return this.http.get<Employee[]>(this.employeesUrl).subscribe({
      next: (res) => {
        this.list = res.map((item) => ({
          ...item,
          dateBirth: new Date(item.dateBirth),
          dateOfDepartment: new Date(item.dateOfDepartment),
        }));
      },
      error: (err) => {
        console.error('Ошибка при загрузке сотрудников:', err);
      },
    });
  }

  fetchEmployees() {
    return this.http.get<Employee[]>(this.employeesUrl).subscribe((res) => {
      this.list = res.map((emp) => ({
        ...emp,
        birthDate: new Date(emp.dateBirth),
        hireDate: new Date(emp.dateOfDepartment),
        fullName: `${emp.surname} ${emp.name} ${emp.patronymic}`,
      }));
    });
  }

  addEmployee(employee: Employee) {
    return this.http.post(this.employeesUrl, employee);
  }
  updateEmployee(employee: Employee) {
    return this.http.put(this.employeesUrl + `/${employee.id}`, employee);
  }
  deleteEmployee(id: number) {
    return this.http.delete(this.employeesUrl + `/${id}`);
  }
}
