using System.ComponentModel.DataAnnotations;

namespace CompanyWebApi.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        public string Department { get; set; }
        public string Surname { get; set; }
        public string Name { get; set; }
        public string Patronymic { get; set; }
        public DateTime DateBirth { get; set; }
        public DateTime DateOfDepartment { get; set; }
        public decimal Salary { get; set; }
    }
}
