
namespace DealFortress.Modules.Notices.Core.Domain.Entities
{
    public abstract class IGetParams
    {
        public required int PageIndex { get; set;}
        public required int PageSize { get; set;}
        public string? SearchTerm { get; set;}
        public string? SortColumn { get; set;}
        public string? SortOrder { get; set;} 
    }
}