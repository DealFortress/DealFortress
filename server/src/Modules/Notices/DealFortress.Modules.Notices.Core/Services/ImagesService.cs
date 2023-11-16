using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Services;

public class ImagesService
{
    public Image ToImage(ImageRequest request, Product product)
    {
        return new Image(){
            Url = request.Url,
            Product = product
        };
    }

    public ImageResponse ToImageResponse(Image image)
    {
        return new ImageResponse(){
            Url = image.Url,
        };
    }
}