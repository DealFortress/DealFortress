using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Tests.Shared;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticeControllersTestsHappy
{
    private readonly NoticesController _controller;
    private readonly Mock<INoticesService> _service;
    private readonly NoticeRequest _request;
    private readonly NoticeResponse _response;

    private readonly Notice _notice;

    public NoticeControllersTestsHappy()
    {
        _service = new Mock<INoticesService>();

        _controller = new NoticesController(_service.Object);

        _request = NoticesTestModels.CreateNoticeRequest();

        _response = NoticesTestModels.CreateNoticeResponse();

        _notice = NoticesTestModels.CreateNotice();
    }


    [Fact]
    public async void GetNotices_should_return_ok()
    {
        // Arrange
        var list = new List<NoticeResponse> { _response };
        _service.Setup(service => service.GetAllAsync()).Returns(Task.FromResult<IEnumerable<NoticeResponse>>(list));
        // Act
        var httpResponses = await _controller.GetNoticesAsync();
        // Assert 
        httpResponses.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetNotices_return_list_of_response_when_server_returns_responsesAsync()
    {
        // Arrange
        var list = new List<NoticeResponse> { _response };
        _service.Setup(service => service.GetAllAsync()).Returns(Task.FromResult<IEnumerable<NoticeResponse>>(list));
        // Act
        var httpResponses = await _controller.GetNoticesAsync();
        // Assert 
        var content = httpResponses.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<List<NoticeResponse>>();
    }
    [Fact]
    public async Task GetNotice_return_ok_when_service_return_responseAsync()
    {
        // Arrange
        _service.Setup(service => service.GetByIdAsync(1)).Returns(Task.FromResult<NoticeResponse?>(_response));
        // Act
        var httpResponse = await _controller.GetNoticeAsync(1);
        // Assert 
        httpResponse.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetNotice_return_response_when_server_returns_responseAsync()
    {
        // Arrange
        _service.Setup(service => service.GetByIdAsync(1)).Returns(Task.FromResult<NoticeResponse?>(_response));
        // Act
        var httpResponse = await _controller.GetNoticeAsync(1);
        // Assert 
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<NoticeResponse>();
    }
    [Fact]
    public async Task PutNotice_returns_response_when_service_return_responseAsync()
    {
        // Arrange
        _service.Setup(service => service.PutByIdAsync(1, _request)).Returns(Task.FromResult<NoticeResponse?>(_response));
        // Act
        var httpResponse = await _controller.PutNoticeAsync(1, _request);
        // Assert 
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<NoticeResponse>();
    }
    [Fact]
    public async Task DeleteNotice_should_return_no_contentAsync()
    {
        // Arrange
        _service.Setup(service => service.DeleteByIdAsync(1)).Returns(Task.FromResult<Notice?>(_notice));
        // Act
        var httpResponse = await _controller.DeleteNoticeAsync(1);
        // Assert 
        httpResponse.Should().BeOfType<NoContentResult>();
    }
}