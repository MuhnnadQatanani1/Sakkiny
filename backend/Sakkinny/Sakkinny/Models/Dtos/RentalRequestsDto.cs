using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sakkinny.Models.Dtos
{
    public class RentalRequestsDto
    {
        public int ApartmentId { get; set; }
        public string ApartmentTitle { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public List<RenterDto> Renters { get; set; } = new List<RenterDto>();
    }
}