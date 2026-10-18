using WMS.API.Models.DTOs;
namespace WMS.API.Interfaces;

public interface IInventoryService
{
    Task<InventoryItemResponse> StockInAsync(StockMovementRequest request, Guid userId);
    Task<InventoryItemResponse> StockOutAsync(StockMovementRequest request, Guid userId);
    Task<InventoryItemResponse> AdjustStockAsync(AdjustStockRequest request, Guid userId);
    Task<List<InventoryItemResponse>> GetStockAsync(Guid? productId, Guid? warehouseId);
}