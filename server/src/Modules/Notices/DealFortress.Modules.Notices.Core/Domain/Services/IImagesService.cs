using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Domain.Services;

public interface IImagesService
{
    ImageResponse ToImageResponseDTO(Image image);

    Image ToImage(ImageRequest request, Product product);
}