using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Sakkinny.Models;
using Sakkinny.Models.Dtos;
using Sakkinny.Services;

namespace Sakkinny.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ApartmentController : ControllerBase
    {
        private readonly ApartmentService _apartmentService;
        private readonly ILogger<ApartmentController> _logger;

        public ApartmentController(ApartmentService apartmentService, ILogger<ApartmentController> logger)
        {
            _apartmentService = apartmentService;
            _logger = logger;
        }


        [HttpPost]
        public async Task<IActionResult> AddApartment(CreateApartmentDto apartmentDto)
        {
            if (apartmentDto == null)
            {
                return BadRequest("Apartment data is required.");
            }

            var result = await _apartmentService.AddApartment(apartmentDto);
            return Ok(result);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateApartment(int id, [FromForm] UpdateApartmentDto apartmentDto)
        {
            if (apartmentDto == null)
            {
                return BadRequest("Apartment data is required.");
            }

            var updatedApartment = await _apartmentService.UpdateApartment(id, apartmentDto);

            if (updatedApartment == null)
            {
                return NotFound($"Apartment with ID {id} not found.");
            }

            return Ok(updatedApartment);
        }

        // Delete Apartment
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApartment(int id)
        {
            var deletedApartment = await _apartmentService.DeleteApartment(id);

            if (deletedApartment == null)
            {
                return NotFound($"Apartment with ID {id} not found.");
            }

            return Ok(deletedApartment);
        }
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<string>>> GetAllApartmentNames()
        {
            _logger.LogInformation("Retrieving all apartment names.");

            try
            {
                var apartmentNames = await _apartmentService.GetAllApartmentNames();
                return Ok(apartmentNames);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving apartment names.");
                return StatusCode(500, "Internal server error while retrieving apartment names.");
            }
        }

        // Get apartment details by ID 
        [HttpGet("{id}")]
        public async Task<IActionResult> GetApartmentDetailsById(int id)
        {
            _logger.LogInformation("Retrieving apartment details for ID: {ApartmentId}", id);

            try
            {

                var apartmentDetails = await _apartmentService.GetApartmentDetailsById(id);

                if (apartmentDetails == null)
                {
                    return NotFound(new { message = $"Apartment with ID {id} not found." });
                }

                return Ok(apartmentDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving apartment details for ID: {ApartmentId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving apartment details." });
            }
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<ApartmentDto>>> GetAllApartments([FromBody] getAllApartmentsDto model)
        {
            var apartments = await _apartmentService.GetAllApartments(model);
            return Ok(new { TotalCount = apartments.Count(), Apartments = apartments });
        }

        // Rent the apartment by Muhnnad
        [HttpPost("apartments/{apartmentId}/rent")]
public async Task<IActionResult> RentApartment(int apartmentId, [FromBody] RentRoomsDto rentRoomsDto)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the current user's ID
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized("User must be logged in to rent an apartment.");
    }

    // Attempt to rent the apartment with specified number of rooms
    var result = await _apartmentService.RentApartment(userId, apartmentId, rentRoomsDto.RoomsToRent);

    if (result == 0)
    {
        return BadRequest("Could not rent the apartment. It may be full or not found.");
    }
    else if (result == -1)
    {
        return BadRequest("You already have an active rental for this apartment. You can only add rooms to your existing rental.");
    }
    else if (result == -2)
    {
        return BadRequest("Not enough rooms available to fulfill your request.");
    }

    return Ok($"Successfully rented {rentRoomsDto.RoomsToRent} room(s) in the apartment.");
}

        // Get Apartments by OwnerId by Muhnnad
        [HttpGet("owner/{ownerId}")]
        public async Task<IActionResult> GetApartmentByOwnerId(string ownerId)
        {
            var apartments = await _apartmentService.GetApartmentByOwnerId(ownerId);

            if (apartments == null || !apartments.Any())
            {
                return NotFound("No apartments found for this owner.");
            }

            return Ok(apartments);
        }

        // Get Customers by OwnerId and ApartmentId by Muhnnad
        [HttpGet("apartments/{apartmentId}/customers")]
        public async Task<IActionResult> GetCustomersByApartment(int apartmentId)
        {
            var customers = await _apartmentService.GetCustomersByApartment(apartmentId);

            if (customers == null || !customers.Any())
            {
                return NotFound("No customers found for this apartment.");
            }

            return Ok(customers);
        }

        // Get Apartment how Customers rent it by Muhnnad
        [HttpGet("customer/{customerId}/rented")]
        public async Task<IActionResult> GetApartmentsRentedByCustomer(string customerId)
        {
            var apartments = await _apartmentService.GetApartmentsRentedByCustomer(customerId);

            if (apartments == null || !apartments.Any())
            {
                return NotFound("No apartments rented by this customer.");
            }

            return Ok(apartments);
        }
[HttpPost("apartments/{apartmentId}/cancel")]
public async Task<IActionResult> CancelApartmentRental(int apartmentId)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get current user's ID
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized("User must be logged in to cancel rental.");
    }

    var result = await _apartmentService.CancelApartmentRental(userId, apartmentId);
    
    if (!result)
    {
        return BadRequest("Could not cancel the rental. You may not have an active rental for this apartment.");
    }

    return Ok("Apartment rental cancelled successfully.");
}

// Get all rental requests/renters for an owner's apartment
[HttpGet("owner/apartments/{apartmentId}/renters")]
public async Task<IActionResult> GetRentalRequestsForApartment(int apartmentId)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get current user's ID
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized("User must be logged in to view rental requests.");
    }

    var result = await _apartmentService.GetRentalRequestsForApartment(userId, apartmentId);
    
    if (result == null)
    {
        return NotFound("Apartment not found or you are not the owner of this apartment.");
    }
    
    return Ok(result);
}
[HttpGet("byrentaltype/{rentalType}")]
public async Task<IActionResult> GetApartmentsByRentalType(RentalType rentalType)
{
    var model = new getAllApartmentsDto
    {
        PageIndex = 1,
        PageSize = 100, // Adjust as needed
        ColumnFilters = new List<KeyValuePair<string, List<string>>>
        {
            new KeyValuePair<string, List<string>>("rentaltype", new List<string> { rentalType.ToString() })
        }
    };

    var apartments = await _apartmentService.GetAllApartments(model);
    return Ok(new { TotalCount = apartments.Count(), Apartments = apartments });
}

    }
}