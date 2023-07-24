.Models;
.Repositories;

namespace DealFortress.Api.Modules.Notices;

public interface INoticesRepository : IRepository<Notice>
{
    IEnumerable<Notice> GetAllWithProducts();

    Notice? GetByIdWithProducts(int id);
}
