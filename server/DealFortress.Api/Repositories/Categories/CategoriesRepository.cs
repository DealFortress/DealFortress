using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Repositories
{
    public class CategoriesRepository: Repository<Notice>, ICategoriesRepository
    {
        public CategoriesRepository(DealFortressContext context) : base(context)
        {

        }

        public DealFortressContext DealFortressContext 
        {
            get { return Context as DealFortressContext; }
        }
    }
}