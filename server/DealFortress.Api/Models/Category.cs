using System.ComponentModel.DataAnnotations;

namespace DealFortress.Api.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        public virtual List<Product>? Products { get; set; }
    }
}
