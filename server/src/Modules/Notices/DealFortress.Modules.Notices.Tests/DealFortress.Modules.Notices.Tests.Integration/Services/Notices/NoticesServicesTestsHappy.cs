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
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Modules.Notices.Tests.Integration;

public class NoticesServicesTestsHappy
{
    private readonly INoticesService _service;
    private readonly NoticeRequest _request;
    public NoticesFixture? Fixture;
    private readonly IMapper _mapper;


    public NoticesServicesTestsHappy()
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

        var usersController = new Mock<UsersController>(null);

        return new NoticesService(noticesRepository, usersController.Object, mapper);
    }

    [Fact]
    public void GetAllPaged_should_return_all_notices()
    {
        var parameters = NoticesTestModels.CreatePagedParams();
        // Act
        var noticeResponses = _service.GetAllPaged(parameters);

        // Assert 
        noticeResponses.Count().Should().Be(2);
    }

    [Fact]
    public async Task GetById_should_return_the_notice_matching_idAsync()
    {
        // Act
        var noticeResponse = await _service.GetByIdAsync(1);

        // Assert 
        noticeResponse?.Title.Should().Be("title 1");
        noticeResponse?.Id.Should().Be(1);
    }

    [Fact]
    public async void Post_should_add_notice_in_db()
    {
        // Arrangel

        // Act
        var postResponse = await _service.PostAsync(_request);

        // Assert
        Fixture?.Context.Notices.Find(postResponse?.Id)?.Title.Should().Be(_request.Title);
    }

    [Fact]
    public async void PutById_should_replace_notice_in_db()
    {
        // Arrange

        // Act
        var putResponse = await _service.PutByIdAsync(1, _request);

        // Assert
        Fixture?.Context.Notices.Find(putResponse?.Id)?.Title.Should().Be(_request.Title);
    }

    [Fact]
    public async Task DeleteById_should_remove_notice_in_dbAsync()
    {
        // Act
        await _service.DeleteByIdAsync(1);

        // Assert 
        Fixture?.Context.Notices.Find(1).Should().BeNull();
    }

}