using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Tests.Shared;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticeControllersTestsSad
{
    private readonly NoticesController _controller;
    private readonly Mock<INoticesService> _service;
    private readonly NoticeRequest _request;
    private readonly NoticeResponse _response;

    private readonly Notice _notice;

    public NoticeControllersTestsSad()
    {
        _service = new Mock<INoticesService>();

        _controller = new NoticesController(_service.Object);

        _request = NoticesTestModels.CreateNoticeRequest();

        _response = NoticesTestModels.CreateNoticeResponse();

        _notice = NoticesTestModels.CreateNotice();
    }


    [Fact]
    public async Task getNotice_returns_not_found_when_service_returns_nullAsync()
    {
        // Arrange
        _service.Setup(service => service.GetByIdAsync(1));

        // Act
        var httpResponse = await _controller.GetNoticeAsync(1);

        // Assert 
        httpResponse.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task putNotice_returns_not_found_when_service_returns_nullAsync()
    {
        // Arrange
        _service.Setup(service => service.PutByIdAsync(1, _request));

        // Act
        var httpResponse = await _controller.PutNoticeAsync(1, _request);

        // Assert 
        httpResponse.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async void deleteNotice_returns_not_found_when_service_returns_null()
    {
        // Arrange
        _service.Setup(service => service.DeleteByIdAsync(1));

        // Act
        var httpResponse = await _controller.DeleteNoticeAsync(1);

        // Assert 
        httpResponse.Should().BeOfType<NotFoundResult>();
    }


}