using Sakkinny.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sakkinny.Services
{
    public interface IApartmentService
    {
        Task<ResultDto> RentApartment(RentApartmentDto rentApartmentDto);
        Task<IEnumerable<ApartmentDto>> GetApartmentByOwnerId(string ownerId);
        Task<IEnumerable<CustomerDto>> GetCustomersByOwnerAndApartmentId(string ownerId, int apartmentId);
    }
}
