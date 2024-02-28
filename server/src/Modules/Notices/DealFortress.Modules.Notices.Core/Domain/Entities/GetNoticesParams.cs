using Microsoft.AspNetCore.Mvc.Filters;

namespace DealFortress.Modules.Notices.Core.Domain.Entities;
public class GetNoticesParams : IGetParams {
    public int? UserId { get; set;}
}
