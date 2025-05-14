using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sakkinny.Models.Dtos
{
       public class RenterDto
    {
        public string UserId { get; set; }
        public int RoomsRented { get; set; }
        public DateTime RentalDate { get; set; }
    }
}