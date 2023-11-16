using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Services;

public class ImagesService: IImagesService
{
    public Image ToImage(ImageRequest request, Product product)
    {
        return new Image(){
            Url = request.Url,
            Product = product
        };
    }

    public ImageResponse ToImageResponseDTO(Image image)
    {
        return new ImageResponse(){
            Url = image.Url,
        };
    }
}