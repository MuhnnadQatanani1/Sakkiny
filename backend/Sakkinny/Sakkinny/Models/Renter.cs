using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sakkinny.Models
{
    public class Renter
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; }
        
        [Required]
        public int ApartmentId { get; set; }
        
        [ForeignKey("ApartmentId")]
        public Apartment Apartment { get; set; }
        
        [Required]
        public int RoomsRented { get; set; } = 1; // Default to 1 room
        
        public DateTime RentalDate { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
    }
}