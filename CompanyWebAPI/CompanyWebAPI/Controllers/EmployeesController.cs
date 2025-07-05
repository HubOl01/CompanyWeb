using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CompanyWebApi.Models;

namespace CompanyWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly EmploeeContext _context;

        public EmployeesController(EmploeeContext context)
        {
            _context = context;
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        // PUT: api/Employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, Employee employee)
        {
            if (id != employee.Id)
            {
                return BadRequest();
            }

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Employees
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEmployee", new { id = employee.Id }, employee);
        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Получить сотрудников, у кого зарплата выше 10000
        [HttpGet("salary/{amount}")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployeesWithSalaryOver(decimal amount)
        {
            return await _context.Employees
                .Where(e => e.Salary > amount)
                .ToListAsync();
        }

        // Удалить сотрудников старше 70 лет
        [HttpDelete("delete-older/{age}")]
        public async Task<IActionResult> DeleteEmployeesOlderThan(int age)
        {
            var today = DateTime.Today;
            var cutoffDate = today.AddYears(-age);

            var employeesToDelete = await _context.Employees
                .Where(e => e.DateBirth < cutoffDate)
                .ToListAsync();

            if (!employeesToDelete.Any())
                return NotFound("Сотрудники старше " + age + " лет не найдены.");

            _context.Employees.RemoveRange(employeesToDelete);
            await _context.SaveChangesAsync();

            return Ok($"{employeesToDelete.Count} сотрудников удалено.");
        }

        // Обновить зарплату до 15000 тем, у кого она меньше
        [HttpPut("update-salary/{newSalary}")]
        public async Task<IActionResult> UpdateSalaryIfLessThan(decimal newSalary)
        {
            var employeesToUpdate = await _context.Employees
                .Where(e => e.Salary < newSalary)
                .ToListAsync();

            if (!employeesToUpdate.Any())
                return Ok("Нет сотрудников с зарплатой ниже " + newSalary);

            foreach (var employee in employeesToUpdate)
            {
                employee.Salary = newSalary;
            }

            await _context.SaveChangesAsync();

            return Ok($"{employeesToUpdate.Count} сотрудников обновлено до зарплаты {newSalary}.");
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }
    }
}
