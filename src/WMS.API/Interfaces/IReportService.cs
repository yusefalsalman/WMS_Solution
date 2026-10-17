using WMS.API.Models.DTOs;

namespace WMS.API.Interfaces;

public interface IReportService
{
    Task<List<WarehouseStockSummary>> GetStockByWarehouseAsync();
    Task<List<LowStockItem>> GetLowStockAsync(Guid? warehouseId);
    Task<List<AuditLogEntry>> GetAuditLogAsync(Guid? productId, Guid? warehouseId, DateTime? from, DateTime? to);
}
