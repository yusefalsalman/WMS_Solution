using WMS.API.Models.DTOs;

namespace WMS.API.Interfaces;

public interface ILowStockAlertService
{
    Task<List<LowStockAlertResponse>> GetActiveAlertsAsync(Guid? warehouseId);
    Task ProcessAlertsAsync(CancellationToken cancellationToken);
}