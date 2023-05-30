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

        public DbSet<DealFortress.Api.Models.SellAd> SellAd { get; set; } = default!;
    }
