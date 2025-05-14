using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sakkinny.Models.Dtos
{
    public class ResultDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    public int? ApartmentId { get; set; } // Make ApartmentId nullable
    }
}