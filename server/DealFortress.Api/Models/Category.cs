using System.ComponentModel.DataAnnotations;

namespace DealFortress.Api.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        public CategoryName Name { get; set; }
        public virtual List<Ad>? Ads { get; set; }
    }

    public enum CategoryName
    {
        CPU,
        GPU,
        SSDAndHDD,
        Cases,
        PSU,
        Cooling,
        MiceAndKeyboards,
        Laptops,
        PC,
        PCMisc,
        MonitorsTvsAndProjectors,
        PhonesTabletsAndSmartWatches,
        Network,
        CamerasAndGear,
        Audio,
        ConsolesAndGear,
        Outdoor,
        Misc
    }
}