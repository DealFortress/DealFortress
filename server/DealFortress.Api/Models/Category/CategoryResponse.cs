using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Api.Models
{
    public class CategoryResponse
    {
        public int Id { get; set; }
        public CategoryName Name { get; set; }
        public virtual List<int>? AdIds { get; set; }
    }
}
