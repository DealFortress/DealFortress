using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Api.Models
{
    public class ProductRequest
    {
        public required string Name { get; set; }
        public required int Price { get; set; }
        public required bool Receipt { get; set; }
        public string? Warranty { get; set; }
        public required int CategoryId { get; set; }
        public required Condition Condition { get; set; }
        public required int SellAdId { get; set; }
    }
}
