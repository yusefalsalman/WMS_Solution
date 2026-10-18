using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WMS.API.Interfaces;
using WMS.API.Models.DTOs;

namespace WMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpPost("stock-in")]
    public async Task<ActionResult<InventoryItemResponse>> StockIn(StockMovementRequest request, [FromServices] IValidator<StockMovementRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return ValidationProblem(new ValidationProblemDetails(validationResult.ToDictionary()));
        }

        var userIdValue = User.FindFirstValue("sub");

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var result = await _inventoryService.StockInAsync(request, userId);
        return Ok(result);
    }

    [HttpPost("stock-out")]
    public async Task<ActionResult<InventoryItemResponse>> StockOut(StockMovementRequest request, [FromServices] IValidator<StockMovementRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return ValidationProblem(new ValidationProblemDetails(validationResult.ToDictionary()));
        }

        var userIdValue = User.FindFirstValue("sub");

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var result = await _inventoryService.StockOutAsync(request, userId);
        return Ok(result);
    }

    [HttpPost("adjust")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<ActionResult<InventoryItemResponse>> Adjustment(AdjustStockRequest request, [FromServices] IValidator<AdjustStockRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return ValidationProblem(new ValidationProblemDetails(validationResult.ToDictionary()));
        }

        var userIdValue = User.FindFirstValue("sub");

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var result = await _inventoryService.AdjustStockAsync(request, userId);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<InventoryItemResponse>>> GetStock(Guid? productId, Guid? warehouseId)
    {
        var result = await _inventoryService.GetStockAsync(productId, warehouseId);
        return Ok(result);
    }
}