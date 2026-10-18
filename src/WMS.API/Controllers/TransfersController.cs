using FluentValidation;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WMS.API.Interfaces;
using WMS.API.Models.DTOs;

namespace WMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransfersController : ControllerBase
{
    private readonly IStockTransferService _stockTransferService;

    public TransfersController(IStockTransferService stockTransferService)
    {
        _stockTransferService = stockTransferService;
    }

    [HttpPost]
    public async Task<ActionResult<StockTransferResponse>> CreateStockTransfer(CreateStockTransferRequest request, [FromServices] IValidator<CreateStockTransferRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return ValidationProblem(new ValidationProblemDetails(validationResult.ToDictionary()));
        }

        var userIdValue = User.FindFirstValue("sub");

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var result = await _stockTransferService.CreateTransferAsync(request, userId);
        return Ok(result);
    }


    [HttpGet]
    public async Task<ActionResult<List<StockTransferResponse>>> GetTransfers()
    {
        var result = await _stockTransferService.GetTransfersAsync();
        return Ok(result);
    }
}
