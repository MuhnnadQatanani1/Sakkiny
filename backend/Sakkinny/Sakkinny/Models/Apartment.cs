using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sakkinny.Models
{
    public class Apartment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string? SubTitle { get; set; }

        [Required]
        public string Location { get; set; }

        public int? RoomsNumber { get; set; }

        public int RoomsAvailable { get; set; }

        public decimal? Price { get; set; }

        // New property for apartment rental type
        [Required]
        public RentalType RentalType { get; set; } = RentalType.ByRoom; // Default to ByRoom

        public ICollection<ApartmentImage> Images { get; set; } = new List<ApartmentImage>();

        // Rental start and end dates
        public DateTime? RentalStartDate { get; set; }
        public DateTime? RentalEndDate { get; set; }

        public bool IsDeleted { get; set; } = false;

        public DateTime CreationTime { get; set; } = DateTime.Now;

        public DateTime? DeletionTime { get; set; }
        
        [NotMapped]
        public ICollection<Renter> Renters { get; set; } = new List<Renter>(); 
        
        public string? OwnerId { get; set; }

        // Helper to check if apartment is full
        public bool IsApartmentFull => RentalType == RentalType.ByRoom 
            ? RoomsAvailable <= 0 
            : Renters.Any(r => r.IsActive); // If WholeApartment, check if any active renter exists
    }

    // Enum to define apartment rental types
    public enum RentalType
    {
        ByRoom = 0,         // Can rent individual rooms
        WholeApartment = 1  // Can only rent the entire apartment
    }
}