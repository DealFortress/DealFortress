using System.ComponentModel.DataAnnotations;

namespace DealFortress.Api.Modules.Categories;

    public class Category
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
    }

