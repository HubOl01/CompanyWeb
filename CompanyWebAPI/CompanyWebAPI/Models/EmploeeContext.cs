using Microsoft.EntityFrameworkCore;

namespace CompanyWebApi.Models
{
    public class EmploeeContext : DbContext
    {
        public EmploeeContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
    }
}
