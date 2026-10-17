using Microsoft.AspNetCore.Mvc;
using WMS.API.Interfaces;
using WMS.API.Models.DTOs;

namespace WMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("stock-by-warehouse")]
    public async Task<ActionResult<List<WarehouseStockSummary>>> GetStockByWarehouse()
    {
        var result = await _reportService.GetStockByWarehouseAsync();
        return Ok(result);
    }

    [HttpGet("low-stock")]
    public async Task<ActionResult<List<LowStockItem>>> GetLowStock(Guid? warehouseId)
    {
        var result = await _reportService.GetLowStockAsync(warehouseId);
        return Ok(result);
    }

    [HttpGet("audit-log")]
    public async Task<ActionResult<List<AuditLogEntry>>> GetAuditLog(
        Guid? productId, Guid? warehouseId, DateTime? from, DateTime? to)
    {
        var result = await _reportService.GetAuditLogAsync(productId, warehouseId, from, to);
        return Ok(result);
    }
}