import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../shared/employee-service';
import { Employee } from '../../../shared/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  styles: ``,
})
export class EmployeeForm implements OnInit {
  @Input() employee: Employee | null = null;
  @Output() close = new EventEmitter<boolean>();

  model: Employee = {
    name: '',
    surname: '',
    patronymic: '',
    department: '',
    salary: 0,
    dateBirth: new Date(),
    dateOfDepartment: new Date(),
  };
  birthStr = '';
  deptStr = '';
  constructor(private service: EmployeeService) {}

  ngOnInit(): void {
    if (this.employee) {
      this.model = { ...this.employee };
    }
    this.birthStr = this.formatDate(this.model.dateBirth);
    this.deptStr = this.formatDate(this.model.dateOfDepartment);
  }
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  save(): void {
    this.model.dateBirth = new Date(this.birthStr);
    this.model.dateOfDepartment = new Date(this.deptStr);

    const operation = this.model.id
      ? this.service.updateEmployee(this.model)
      : this.service.addEmployee(this.model);

    operation.subscribe({
      next: () => this.close.emit(true),
      error: (err) => {
        console.error('Ошибка сохранения:', err);
        alert('Ошибка сохранения');
      },
    });
  }

  cancel(): void {
    this.close.emit(false);
  }
}
