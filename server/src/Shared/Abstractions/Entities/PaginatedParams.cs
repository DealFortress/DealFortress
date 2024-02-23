
namespace DealFortress.Shared.Abstractions.Entities;
public class PaginatedParams {
    public int PageIndex { get; set; } = 0;
    public int PageSize { get; set; } = 20;
    public int? FilterId { get; set; }

}