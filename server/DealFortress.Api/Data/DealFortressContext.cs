using Microsoft.EntityFrameworkCore;

public class DealFortressContext : DbContext
{
    public DealFortressContext(DbContextOptions<DealFortressContext> options)
        : base(options)
    {
    }

    public DbSet<DealFortress.Api.Products.Product> Products { get; set; } = default!;
    public DbSet<DealFortress.Api.Notices.Notice> Notices { get; set; } = default!;
    public DbSet<DealFortress.Api.Categories.Category> Categories { get; set; } = default!;
}
