using Microsoft.EntityFrameworkCore;
using WMS.API.Data;
using WMS.API.Interfaces;
using WMS.API.Models.DTOs;
using WMS.API.Models.Entities;

namespace WMS.API.Services;

public class LowStockAlertService : ILowStockAlertService
{
    private readonly AppDbContext _dbContext;

    public LowStockAlertService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<LowStockAlertResponse>> GetActiveAlertsAsync(Guid? warehouseId)
    {
        return await _dbContext.LowStockAlerts
            .AsNoTracking()
            .Where(alert => alert.IsActive)
            .Where(alert => warehouseId == null || alert.InventoryItem.WarehouseId == warehouseId)
            .OrderBy(alert => alert.DetectedAt)
            .Select(alert => new LowStockAlertResponse(
                alert.Id,
                alert.InventoryItem.Product.SKU,
                alert.InventoryItem.Product.Name,
                alert.InventoryItem.Warehouse.Code,
                alert.InventoryItem.Quantity,
                alert.ThresholdAtDetection,
                alert.DetectedAt
            ))
            .ToListAsync();
    }

    public async Task ProcessAlertsAsync(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;

        var lowStockItems = await _dbContext.InventoryItems
            .Include(item => item.Product)
            .Include(item => item.Warehouse)
            .Where(item =>
                item.Product.IsActive &&
                item.Warehouse.IsActive &&
                item.Quantity < item.Product.LowStockThreshold)
            .ToListAsync(cancellationToken);

        var alerts = await _dbContext.LowStockAlerts
            .ToListAsync(cancellationToken);

        var alertsByInventoryId = alerts.ToDictionary(
            alert => alert.InventoryItemId);

        var lowStockInventoryIds = lowStockItems
            .Select(item => item.Id)
            .ToHashSet();

        foreach (var item in lowStockItems)
        {
            if (!alertsByInventoryId.TryGetValue(item.Id, out var alert))
            {
                _dbContext.LowStockAlerts.Add(new LowStockAlert
                {
                    InventoryItemId = item.Id,
                    QuantityAtDetection = item.Quantity,
                    ThresholdAtDetection = item.Product.LowStockThreshold,
                    DetectedAt = now,
                    IsActive = true
                });

                continue;
            }

            if (!alert.IsActive)
            {
                alert.QuantityAtDetection = item.Quantity;
                alert.ThresholdAtDetection = item.Product.LowStockThreshold;
                alert.DetectedAt = now;
                alert.IsActive = true;
                alert.ResolvedAt = null;
                alert.UpdatedAt = now;
            }
        }

        foreach (var alert in alerts.Where(alert =>
            alert.IsActive &&
            !lowStockInventoryIds.Contains(alert.InventoryItemId)))
        {
            alert.IsActive = false;
            alert.ResolvedAt = now;
            alert.UpdatedAt = now;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}