using Sakkinny.Models;

namespace Sakkinny.Models.Dtos
{
    public class UpdateApartmentDto
    {
        public string? title { get; set; }
        public string? subTitle { get; set; }
        public string? location { get; set; }
        public int? roomsNumber { get; set; }
        public int? roomsAvailable { get; set; }
        public decimal? price { get; set; }
        
        // Add rental type
        public RentalType? rentalType { get; set; }
        
        public List<IFormFile> Images { get; set; }
    }
}