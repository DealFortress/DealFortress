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
    public void GetNotices_should_return_ok()
    {
        // Arrange
        var content = new List<NoticeResponse> { _response };
        _service.Setup(service => service.GetAll()).Returns(content);
        // Act
        var httpResponses = _controller.GetNotices();
        // Assert 
        httpResponses.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void GetNotices_return_list_of_response_when_server_returns_responses()
    {
        // Arrange
        var list = new List<NoticeResponse> { _response };
        _service.Setup(service => service.GetAll()).Returns(list);
        // Act
        var httpResponses = _controller.GetNotices();
        // Assert 
        var content = httpResponses.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<List<NoticeResponse>>();
    }
    [Fact]
    public void GetNotice_return_ok_when_service_return_response()
    {
        // Arrange
        _service.Setup(service => service.GetById(1)).Returns(_response);
        // Act
        var httpResponse = _controller.GetNotice(1);
        // Assert 
        httpResponse.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void GetNotice_return_response_when_server_returns_response()
    {
        // Arrange
        _service.Setup(service => service.GetById(1)).Returns(_response);
        // Act
        var httpResponse = _controller.GetNotice(1);
        // Assert 
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<NoticeResponse>();
    }
    [Fact]
    public void PutNotice_returns_response_when_service_return_response()
    {
        // Arrange
        _service.Setup(service => service.PutById(1, _request)).Returns(_response);
        // Act
        var httpResponse = _controller.PutNotice(1, _request);
        // Assert 
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<NoticeResponse>();
    }
    [Fact]
    public void DeleteNotice_should_return_no_content()
    {
        // Arrange
        _service.Setup(service => service.DeleteById(1)).Returns(_notice);
        // Act
        var httpResponse = _controller.DeleteNotice(1);
        // Assert 
        httpResponse.Should().BeOfType<NoContentResult>();
    }
}