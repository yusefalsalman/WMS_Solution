using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WMS.API.Interfaces;
using WMS.API.Models.DTOs;

namespace WMS.API.Controllers;

[ApiController]
[Route("api/alerts")]
[Authorize(Roles = "Manager,Admin")]
public class LowStockAlertsController : ControllerBase
{
    private readonly ILowStockAlertService _alertService;

    public LowStockAlertsController(ILowStockAlertService alertService)
    {
        _alertService = alertService;
    }

    [HttpGet]
    public async Task<ActionResult<List<LowStockAlertResponse>>> GetActiveAlerts([FromQuery] Guid? warehouseId)
    {
        var alerts = await _alertService.GetActiveAlertsAsync(warehouseId);
        return Ok(alerts);
    }
}
