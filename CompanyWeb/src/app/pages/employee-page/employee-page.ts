import { Component, OnInit } from '@angular/core';
import { Employee } from '../../shared/employee.model';
import { EmployeeService } from '../../shared/employee-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeForm } from "./employee-form/employee-form";

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [FormsModule, CommonModule, EmployeeForm],
  templateUrl: './employee-page.html',
  styles: ``,
})
export class EmployeePage implements OnInit {
  filters = {
    department: '',
    fullName: '',
    birthDate: '',
    hireDate: '',
    salary: '',
  };
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showModal = false;
  selectedEmployee: Employee | null = null;

  constructor(public service: EmployeeService) {}

  ngOnInit(): void {
    this.refresh();
  }

  get filteredEmployees(): Employee[] {
    let filtered = this.service.list.filter((emp) => {
      const fullName =
        `${emp.surname} ${emp.name} ${emp.patronymic}`.toLowerCase();
      return (
        emp.department
          .toLowerCase()
          .includes(this.filters.department.toLowerCase()) &&
        fullName.includes(this.filters.fullName.toLowerCase()) &&
        (!this.filters.birthDate ||
          new Date(emp.dateBirth).toISOString().split('T')[0] ===
            this.filters.birthDate) &&
        (!this.filters.hireDate ||
          new Date(emp.dateOfDepartment).toISOString().split('T')[0] ===
            this.filters.hireDate) &&
        (!this.filters.salary ||
          emp.salary.toString().includes(this.filters.salary))
      );
    });

    if (this.sortColumn) {
      filtered = filtered.sort((a: any, b: any) => {
        const valueA = this.getSortValue(a, this.sortColumn);
        const valueB = this.getSortValue(b, this.sortColumn);
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  getSortValue(emp: Employee, column: string): any {
    switch (column) {
      case 'department':
        return emp.department;
      case 'fullName':
        return `${emp.surname} ${emp.name} ${emp.patronymic}`;
      case 'birthDate':
        return emp.dateBirth;
      case 'hireDate':
        return emp.dateOfDepartment;
      case 'salary':
        return emp.salary;
    }
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  openCreateModal(): void {
    this.selectedEmployee = null;
    this.showModal = true;
  }

  openEditModal(emp: Employee): void {
    this.selectedEmployee = { ...emp };
    this.showModal = true;
  }

  closeModal(refresh: boolean): void {
    this.showModal = false;
    this.selectedEmployee = null;
    if (refresh) this.refresh();
  }

  confirmDelete(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      this.service.deleteEmployee(id).subscribe(() => this.refresh());
    }
  }

  refresh(): void {
    this.service.refreshList();
  }
}
