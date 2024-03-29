using Moq;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Integration.Fixture;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Tests.Shared;
using DealFortress.Modules.Users.Api.Controllers;
using AutoMapper;

namespace DealFortress.Modules.Notices.Tests.Integration;

public class NoticesServicesTestsSad
{
    private readonly INoticesService _service;
    private readonly NoticeRequest _request;
    public NoticesFixture? Fixture;
    private readonly IMapper _mapper;


    public NoticesServicesTestsSad()
    {
        _mapper = NoticesTestModels.CreateMapper(); 
        _service = CreateNewService(_mapper);
    
        _request = NoticesTestModels.CreateNoticeRequest();
    }

    public INoticesService CreateNewService(IMapper mapper)
    {
        Fixture?.Dispose();        

        Fixture = new NoticesFixture();

        var noticesRepository = new NoticesRepository(Fixture.Context);

        

        var usersController = new Mock<UsersController>(null).Object;


        return new NoticesService( noticesRepository, usersController, mapper);
    }

    [Fact]
    public async Task GetByIdAsync_returns_null_when_notice_is_not_found()
    {
        // Act
        var noticeResponses = await _service.GetByIdAsync(-1);

        // Assert 
        noticeResponses.Should().Be(null);
    }

    [Fact]
    public async Task PutByIdAsync_returns_null_when_notice_is_not_found()
    {
        // Act
        var response = await _service.PutByIdAsync(-1, _request);

        // Assert
        response.Should().BeNull();
    }

    [Fact]
    public async Task DeleteByIdAsync_returns_null_when_notice_is_not_found()
    {
        // Act
        var response = await _service.DeleteByIdAsync(-1);

        // Assert
        response.Should().BeNull();
    }
}