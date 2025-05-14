using Sakkinny.Models;

namespace Sakkinny.Models.Dtos
{
    public class ApartmentDto
    {   
        public int Id { get; set; }
        public string? title { get; set; }
        public string? subTitle { get; set; }
        public string? location { get; set; }
        public int? roomsNumber { get; set; }
        public int? roomsAvailable { get; set; }
        public decimal? price { get; set; }
        public string OwnerId { get; set; } 
        
        // Add rental type
        public RentalType rentalType { get; set; }
        
        // Add a property to indicate if apartment is available
        public bool isAvailable { get; set; }

        public List<IFormFile>? Images { get; set; }
    }
}