using AutoMapper;
using Sakkinny.Models;
using Sakkinny.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Sakkinny.Services
{
    public class ApartmentService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        private readonly ILogger<ApartmentService> _logger;

        public ApartmentService(IMapper mapper, DataContext context, ILogger<ApartmentService> logger)
        {
            _mapper = mapper;
            _context = context;
            _logger = logger;
        }

        public async Task<ApartmentDto> AddApartment(CreateApartmentDto apartmentDto)
        {
            var apartment = _mapper.Map<Apartment>(apartmentDto);
            apartment.CreationTime = DateTime.UtcNow;
            if (apartmentDto.Images == null || !apartmentDto.Images.Any())
            {
                _logger.LogWarning("Attempted to add an apartment without images: {ApartmentName}", apartmentDto.title);
                throw new ArgumentException("At least one image is required.");
            }
            if (apartmentDto.roomsNumber < apartmentDto.roomsAvailable)
            {
                _logger.LogWarning("Validation error for apartment: {ApartmentName}. RoomsNumber must be greater than RoomsAvailable.", apartmentDto.title);
                throw new ArgumentException("RoomsNumber must be greater than RoomsAvailable.");
            }

            if (apartmentDto.price <= 0)
            {
                _logger.LogWarning("Validation error for apartment: {ApartmentName}. Price must be greater than zero.", apartmentDto.title);
                throw new ArgumentException("Price must be greater than zero.");
            }

            _logger.LogInformation("Adding apartment: {ApartmentName}", apartmentDto.title);

            try
            {

                apartment.Images = new List<ApartmentImage>();

                foreach (var imageFile in apartmentDto.Images)
                {
                    using var memoryStream = new MemoryStream();
                    await imageFile.CopyToAsync(memoryStream);
                    var apartmentImage = new ApartmentImage
                    {
                        ImageData = memoryStream.ToArray(),  // Convert image to byte array
                        Apartment = apartment                 // Associate image with apartment
                    };
                    apartment.Images.Add(apartmentImage);
                }
                await _context.Apartments.AddAsync(apartment);
                await _context.SaveChangesAsync();
                var apartmentDtoResult = _mapper.Map<ApartmentDto>(apartment);
                _logger.LogInformation("Apartment added with ID: {ApartmentId}", apartmentDtoResult.Id);
                return apartmentDtoResult;
            }
            catch (ArgumentException argEx)
            {

                _logger.LogError(argEx, "Validation error adding apartment: {ApartmentName}", apartmentDto.title);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding apartment: {ApartmentName}", apartmentDto.title);
                throw new ApplicationException("Error adding apartment", ex);
            }
        }
        public async Task<ApartmentDto> UpdateApartment(int id, UpdateApartmentDto apartmentDto)
        {
            _logger.LogInformation("Attempting to update apartment with ID: {ApartmentId}", id);

            try
            {
                var apartment = await _context.Apartments
                    .Include(a => a.Images)
                    .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);

                if (apartment == null)
                {
                    _logger.LogWarning("Apartment with ID: {ApartmentId} not found", id);
                    return null;
                }

                if (apartmentDto == null)
                {
                    throw new ArgumentNullException(nameof(apartmentDto), "UpdateApartmentDto cannot be null");
                }

                _logger.LogInformation("Updating apartment with data: {@ApartmentDto}", apartmentDto);

                if (!string.IsNullOrEmpty(apartmentDto.title))
                {
                    apartment.Title = apartmentDto.title;
                }

                if (!string.IsNullOrEmpty(apartmentDto.location))
                {
                    apartment.Location = apartmentDto.location;
                }

                if (apartmentDto.price.HasValue)
                {
                    apartment.Price = apartmentDto.price.Value;
                }

                if (apartmentDto.roomsNumber.HasValue)
                {
                    apartment.RoomsNumber = apartmentDto.roomsNumber.Value;
                    apartment.RoomsAvailable = apartmentDto.roomsAvailable.Value;


                }

                if (apartmentDto.Images != null && apartmentDto.Images.Count > 0)
                {
                    apartment.Images.Clear();

                    foreach (var file in apartmentDto.Images)
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await file.CopyToAsync(memoryStream);

                            var apartmentImage = new ApartmentImage
                            {
                                ImageData = memoryStream.ToArray(),
                                Apartment = apartment // Associate the image with the apartment

                            };

                            apartment.Images.Add(apartmentImage);
                        }
                    }
                }

                await _context.SaveChangesAsync();

                var apartmentDtoResult = _mapper.Map<ApartmentDto>(apartment);

                _logger.LogInformation("Apartment updated successfully with ID: {ApartmentId}", apartmentDtoResult.Id);
                return apartmentDtoResult;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating apartment with ID: {ApartmentId}", id);
                throw new ApplicationException("Error updating apartment", ex);
            }
        }

        public async Task<ApartmentDto> DeleteApartment(int id)
        {
            _logger.LogInformation("Attempting to delete apartment with ID: {ApartmentId}", id);

            try
            {
                var apartment = await _context.Apartments.FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);
                if (apartment == null)
                {
                    _logger.LogWarning("Apartment with ID: {ApartmentId} not found", id);
                    return null;
                }

                apartment.IsDeleted = true;
                apartment.DeletionTime = DateTime.Now;

                await _context.SaveChangesAsync();
                _logger.LogInformation("Apartment marked as deleted with ID: {ApartmentId}", id);
                return _mapper.Map<ApartmentDto>(apartment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking apartment as deleted with ID: {ApartmentId}", id);
                throw new InvalidOperationException("Error deleting apartment", ex);
            }
        }

        public async Task<IEnumerable<string>> GetAllApartmentNames()
        {
            _logger.LogInformation("Retrieving all apartment names.");

            try
            {
                var apartmentNames = await _context.Apartments
                    .Where(a => !a.IsDeleted)
                    .Select(a => a.Title)
                    .ToListAsync();

                _logger.LogInformation("Retrieved {Count} apartment names.", apartmentNames.Count);
                return apartmentNames;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving apartment names.");
                throw new ApplicationException("Error retrieving apartment names", ex);
            }
        }

       public async Task<getApartmentDetailsDto> GetApartmentDetailsById(int id)
{
    _logger.LogInformation("Attempting to retrieve apartment data with ID: {ApartmentId}", id);

    try
    {
        var apartment = await _context.Apartments
            .Include(a => a.Images)
            .Include(a => a.Renters)
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);

        if (apartment == null)
        {
            return null;
        }

        var base64Images = apartment.Images
            .Select(img => Convert.ToBase64String(img.ImageData))
            .ToList();

        // Determine if apartment is available based on rental type
        bool isAvailable;
        if (apartment.RentalType == RentalType.WholeApartment)
        {
            isAvailable = !apartment.Renters.Any(r => r.IsActive);
        }
        else // RentalType.ByRoom
        {
            isAvailable = apartment.RoomsAvailable > 0;
        }

        _logger.LogInformation("Retrieved apartment details for ID: {ApartmentId}", id);
        return new getApartmentDetailsDto
        {
            Title = apartment.Title,
            Base64Images = base64Images,
            subTitle = apartment.SubTitle,
            location = apartment.Location,
            roomsNumber = apartment.RoomsNumber,
            roomsAvailable = apartment.RoomsAvailable,
            price = apartment.Price,
            OwnerId = apartment.OwnerId,
            rentalType = apartment.RentalType,
            isAvailable = isAvailable
        };
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error retrieving apartment with ID: {ApartmentId}", id);
        throw new InvalidOperationException("Error retrieving apartment", ex);
    }
}       public async Task<IEnumerable<object>> GetAllApartments(getAllApartmentsDto model)
{
    try
    {
        var query = _context.Apartments
            .Include(a => a.Renters)
            .AsQueryable();
        
        query = query.Where(a => !a.IsDeleted);

        if (!string.IsNullOrWhiteSpace(model.SearchTerm))
        {
            query = query.Where(a => a.Title.Contains(model.SearchTerm) || 
                                    a.SubTitle.Contains(model.SearchTerm) || 
                                    a.Location.Contains(model.SearchTerm));
        }

        if (model.ColumnFilters != null && model.ColumnFilters.Any())
        {
            foreach (var filter in model.ColumnFilters)
            {
                if (!string.IsNullOrWhiteSpace(filter.Key) && filter.Value != null && filter.Value.Any())
                {
                    switch (filter.Key.ToLower())
                    {
                        case "title":
                            query = query.Where(a => filter.Value.Any(val => a.Title.Contains(val)));
                            break;
                        case "location":
                            query = query.Where(a => filter.Value.Any(val => a.Location.Contains(val)));
                            break;
                        case "roomsnumber":
                            var roomsNumbers = filter.Value
                                .Select(val => int.TryParse(val, out var number) ? number : (int?)null)
                                .Where(val => val.HasValue)
                                .ToList();
                            if (roomsNumbers.Any())
                            {
                                query = query.Where(a => roomsNumbers.Contains(a.RoomsNumber));
                            }
                            break;
                        case "roomsavailable":
                            var roomsAvailables = filter.Value
                                .Select(val => int.TryParse(val, out var available) ? available : (int?)null)
                                .Where(val => val.HasValue)
                                .ToList();
                            if (roomsAvailables.Any())
                            {
                                query = query.Where(a => roomsAvailables.Contains(a.RoomsAvailable));
                            }
                            break;
                        case "rentaltype":
                            var rentalTypes = filter.Value
                                .Select(val => Enum.TryParse<RentalType>(val, out var type) ? type : (RentalType?)null)
                                .Where(val => val.HasValue)
                                .ToList();
                            if (rentalTypes.Any())
                            {
                                query = query.Where(a => rentalTypes.Contains(a.RentalType));
                            }
                            break;
                    }
                }
            }
        }

        var totalItems = await query.CountAsync();
        var apartments = await query
            .Skip((model.PageIndex - 1) * model.PageSize)
            .Take(model.PageSize)
            .Include(m => m.Images)
            .ToListAsync();

        return apartments.Select(apartment => new
        {
            Id = (int)apartment.Id,
            title = apartment.Title,
            subTitle = apartment.SubTitle,
            location = apartment.Location,
            roomsNumber = apartment.RoomsNumber,
            roomsAvailable = apartment.RoomsAvailable,
            price = apartment.Price,
            rentalType = apartment.RentalType,
            isAvailable = apartment.RentalType == RentalType.WholeApartment 
                ? !apartment.Renters.Any(r => r.IsActive)
                : apartment.RoomsAvailable > 0,
            Image = apartment.Images != null && apartment.Images.Any()
                ? Convert.ToBase64String(apartment.Images.First().ImageData)
                : null
        }).ToList();
    }
    catch (Exception ex)
    {
        Debug.WriteLine(ex, "ex");
        return new List<object>();
    }
}
        // rent the apartment  by Muhnnad
      public async Task<int> RentApartment(string userId, int apartmentId, int roomsToRent)
{
    if (roomsToRent <= 0)
    {
        _logger.LogWarning("Attempted to rent invalid number of rooms: {RoomsToRent}", roomsToRent);
        return 0; // Invalid rooms count
    }

    // Find the apartment by ID
    var apartment = await _context.Apartments
        .Include(a => a.Renters)
        .FirstOrDefaultAsync(a => a.Id == apartmentId && !a.IsDeleted);

    // Check if the apartment exists
    if (apartment == null)
    {
        _logger.LogWarning("Apartment {ApartmentId} not found", apartmentId);
        return 0; // Apartment not found
    }

    // Check if user already has an active rental for this apartment
    var existingRental = await _context.Renters
        .FirstOrDefaultAsync(r => r.UserId == userId && r.ApartmentId == apartmentId && r.IsActive);

    // Handle based on rental type
    if (apartment.RentalType == RentalType.WholeApartment)
    {
        // For whole apartment rental, check if it's already rented
        var anyActiveRenter = await _context.Renters
            .AnyAsync(r => r.ApartmentId == apartmentId && r.IsActive);

        // If already rented and not by this user, reject
        if (anyActiveRenter && existingRental == null)
        {
            _logger.LogWarning("Whole apartment {ApartmentId} is already rented by someone else", apartmentId);
            return -3; // Already rented by someone else
        }

        // If already rented by this user, reject additional rental
        if (existingRental != null)
        {
            _logger.LogWarning("User {UserId} already rents the whole apartment {ApartmentId}", userId, apartmentId);
            return -1; // Already rented by this user
        }

        // Create a new rental for the whole apartment
        var renter = new Renter
        {
            UserId = userId,
            ApartmentId = apartmentId,
            RoomsRented = apartment.RoomsNumber ?? 1, // Rent all rooms
            RentalDate = DateTime.UtcNow,
            IsActive = true
        };

        // Set available rooms to 0 since the whole apartment is rented
        apartment.RoomsAvailable = 0;
        
        // Add renter to the context
        _context.Renters.Add(renter);
        await _context.SaveChangesAsync();
        
        return apartment.RoomsNumber ?? 1; // Return the number of rooms rented (all rooms)
    }
    else // RentalType.ByRoom
    {
        // Check if there are enough available rooms
        if (apartment.RoomsAvailable < roomsToRent)
        {
            _logger.LogWarning("Not enough rooms available in apartment {ApartmentId}. Requested: {RoomsToRent}, Available: {RoomsAvailable}", 
                apartmentId, roomsToRent, apartment.RoomsAvailable);
            return -2; // Not enough rooms available
        }

        if (existingRental != null)
        {
            _logger.LogInformation("User {UserId} already has an active rental for apartment {ApartmentId}. Adding rooms.", userId, apartmentId);
            
            // Update the existing rental by adding more rooms
            existingRental.RoomsRented += roomsToRent;
        }
        else
        {
            _logger.LogInformation("Creating new rental for user {UserId} for apartment {ApartmentId} with {RoomsToRent} rooms", 
                userId, apartmentId, roomsToRent);
            
            // Create a new renter entry
            var renter = new Renter
            {
                UserId = userId,
                ApartmentId = apartmentId,
                RoomsRented = roomsToRent,
                RentalDate = DateTime.UtcNow,
                IsActive = true
            };

            // Add renter to the context
            _context.Renters.Add(renter);
        }

        // Update available rooms in the apartment
        apartment.RoomsAvailable -= roomsToRent;
        
        // Save changes to the database
        await _context.SaveChangesAsync();
        return roomsToRent; // Return the number of rooms rented
    }
}

        // Get Customers by OwnerId and ApartmentId
        public async Task<IEnumerable<CustomerDto>> GetCustomersByApartment(int apartmentId)
        {
            // Retrieve the apartment with the specified apartmentId, including the renters
            var apartment = await _context.Apartments
                .Include(a => a.Renters)
                .ThenInclude(r => r.User) 
                .FirstOrDefaultAsync(a => a.Id == apartmentId && !a.IsDeleted);

            if (apartment == null)
            {
                // Return an empty list or handle the case where no apartment is found
                return new List<CustomerDto>();
            }

            var customers = apartment.Renters.Select(renter => new CustomerDto
            {
                CustomerId = renter.UserId,
            }).ToList();

            return customers;
        }

        // Get Apartment how Customers rent it 

        public async Task<IEnumerable<ApartmentDto>> GetApartmentsRentedByCustomer(string customerId)
        {
            var apartments = await _context.Apartments
                .Where(a => a.Renters.Any(r => r.UserId == customerId))  // Check for renters
                .Include(a => a.Images)
                .ToListAsync();

            return apartments.Select(a => new ApartmentDto
            {
                Id = a.Id,
                title = a.Title,
                subTitle = a.SubTitle,
                location = a.Location,
                roomsNumber = a.RoomsNumber,
                roomsAvailable = a.RoomsAvailable,
                price = a.Price,
            });
        }
public async Task<bool> CancelApartmentRental(string userId, int apartmentId)
{
    _logger.LogInformation("Attempting to cancel rental for user {UserId} for apartment {ApartmentId}", userId, apartmentId);
    
    // Find the active rental for this user and apartment
    var rental = await _context.Renters
        .FirstOrDefaultAsync(r => r.UserId == userId && r.ApartmentId == apartmentId && r.IsActive);
    
    if (rental == null)
    {
        _logger.LogWarning("No active rental found for user {UserId} for apartment {ApartmentId}", userId, apartmentId);
        return false;
    }
    
    // Find the apartment
    var apartment = await _context.Apartments
        .FirstOrDefaultAsync(a => a.Id == apartmentId && !a.IsDeleted);
    
    if (apartment == null)
    {
        _logger.LogWarning("Apartment {ApartmentId} not found or is deleted", apartmentId);
        return false;
    }
    
    // Mark the rental as inactive
    rental.IsActive = false;
    
    // Return the rooms to the available count
    apartment.RoomsAvailable += rental.RoomsRented;
    
    // Save changes
    await _context.SaveChangesAsync();
    
    _logger.LogInformation("Successfully cancelled rental for user {UserId} for apartment {ApartmentId}, returned {RoomsCount} rooms", 
        userId, apartmentId, rental.RoomsRented);
    
    return true;
}

// Method for apartment owners to view all rental requests/renters
public async Task<RentalRequestsDto> GetRentalRequestsForApartment(string userId, int apartmentId)
{
    _logger.LogInformation("Retrieving rental requests for apartment {ApartmentId} requested by user {UserId}", apartmentId, userId);
    
    // Find the apartment and verify ownership
    var apartment = await _context.Apartments
        .FirstOrDefaultAsync(a => a.Id == apartmentId && a.OwnerId == userId && !a.IsDeleted);
    
    if (apartment == null)
    {
        _logger.LogWarning("Apartment {ApartmentId} not found or user {UserId} is not the owner", apartmentId, userId);
        return null;
    }
    
    // Get all active renters for this apartment
    var renters = await _context.Renters
        .Where(r => r.ApartmentId == apartmentId && r.IsActive)
        .OrderByDescending(r => r.RentalDate)
        .ToListAsync();
    
    // Map to DTO
    var rentalRequestsDto = new RentalRequestsDto
    {
        ApartmentId = apartment.Id,
        ApartmentTitle = apartment.Title,
        TotalRooms = apartment.RoomsNumber ?? 0,
        AvailableRooms = apartment.RoomsAvailable,
        Renters = renters.Select(r => new RenterDto
        {
            UserId = r.UserId,
            RoomsRented = r.RoomsRented,
            RentalDate = r.RentalDate
        }).ToList()
    };
    
    _logger.LogInformation("Retrieved {RentersCount} renters for apartment {ApartmentId}", renters.Count, apartmentId);
    
    return rentalRequestsDto;
}

        public async Task<IEnumerable<ApartmentDto>> GetApartmentByOwnerId(string ownerId)
        {
            var apartments = await _context.Apartments
                .Where(a => a.OwnerId == ownerId && !a.IsDeleted)
                .ToListAsync();

            return apartments.Select(a => new ApartmentDto
            {
                Id = a.Id,
                title = a.Title,
                subTitle = a.SubTitle,
                location = a.Location,
                roomsNumber = a.RoomsNumber,
                roomsAvailable = a.RoomsAvailable,
                price = a.Price,
            });
        }

    }
}