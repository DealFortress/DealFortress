using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;

    public class DealFortressContext : DbContext
    {
        public DealFortressContext (DbContextOptions<DealFortressContext> options)
            : base(options)
        {
        }

        public DbSet<DealFortress.Api.Models.SellAd> SellAds { get; set; } = default!;

        public DbSet<DealFortress.Api.Models.Product> Products { get; set; } = default!;

        public DbSet<DealFortress.Api.Models.Category> Category { get; set; } = default!;
    }
