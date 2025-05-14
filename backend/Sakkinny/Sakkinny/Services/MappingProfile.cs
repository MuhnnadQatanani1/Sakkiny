using AutoMapper;
using Sakkinny.Models;
using Sakkinny.Models.Dtos;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Sakkinny.Services
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateApartmentDto, Apartment>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => ConvertToApartmentImages(src.Images)));

            CreateMap<Apartment, ApartmentDto>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => ConvertToIFormFiles(src.Images)));

            CreateMap<UpdateApartmentDto, Apartment>().ForMember(dest => dest.Images, opt => opt.MapFrom(src => ConvertToApartmentImages(src.Images)));
                ;
        }

        private List<ApartmentImage> ConvertToApartmentImages(List<IFormFile> files)
        {
            return files.Select(file => new ApartmentImage
            {
                ImageData = ConvertToByteArray(file),
            }).ToList(); 
        }

        private List<IFormFile> ConvertToIFormFiles(IEnumerable<ApartmentImage> images) 
        {
            return images.Select(image => ConvertToIFormFile(image)).ToList();
        }

        private byte[] ConvertToByteArray(IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            file.CopyTo(memoryStream);
            return memoryStream.ToArray();
        }

        private IFormFile ConvertToIFormFile(ApartmentImage image)
        {
            var stream = new MemoryStream(image.ImageData);
            var file = new FormFile(stream, 0, stream.Length, "file", "image.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            return file;
        }
    }
}
