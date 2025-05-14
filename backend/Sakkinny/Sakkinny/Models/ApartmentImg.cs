using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sakkinny.Models
{
    public class ApartmentImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public byte[]? ImageData { get; set; }

        public int ApartmentId { get; set; }

        [ForeignKey("ApartmentId")]
        public Apartment? Apartment { get; set; }
    }
}
