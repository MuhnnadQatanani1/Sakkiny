using Sakkinny.Models;

namespace Sakkinny.Models.Dtos
{
    public class getApartmentDetailsDto
    {
        public string? Title { get; set; }
        public string? subTitle { get; set; }
        public string? location { get; set; }

        public string? OwnerId { get; set; }
        public int? roomsNumber { get; set; }
        public int? roomsAvailable { get; set; }
        public decimal? price { get; set; }
        
        // Add rental type
        public RentalType rentalType { get; set; }
        
        // Add a property to indicate if apartment is available for rent
        public bool isAvailable { get; set; }

        public List<string>? Base64Images { get; set; }
    }
}