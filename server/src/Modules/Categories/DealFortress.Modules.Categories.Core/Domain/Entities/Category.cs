using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Categories.Core.Domain.Entities;

    public class Category
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
    }

