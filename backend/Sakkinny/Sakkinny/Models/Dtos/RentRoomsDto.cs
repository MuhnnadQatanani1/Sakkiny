using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Sakkinny.Models.Dtos
{
  public class RentRoomsDto
    {
        [Required]
        [Range(1, 100, ErrorMessage = "You must rent at least 1 room and no more than 100 rooms.")]
        public int RoomsToRent { get; set; } = 1; // Default to 1 room if not specified
    }
}