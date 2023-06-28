namespace DealFortress.Api.Models
{
    public class CategoryResponse
    {

        public int Id { get; set; }
        public required string Name { get; set; }
        public virtual List<ProductResponse>? Products { get; set; }
    }
}
