using AutoMapper;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.DTO;


namespace Abstractions.Automapper
{
    public class AutoMappingUserProfiles : Profile
    {
        public AutoMappingUserProfiles () {
            CreateMap<User, UserResponse>();
            CreateMap<UserRequest, User>();
        }
    }
}