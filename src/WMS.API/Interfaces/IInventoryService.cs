using WMS.API.Models.DTOs;
namespace WMS.API.Interfaces;

public interface IInventoryService
{
    Task<InventoryItemResponse> StockInAsync(StockMovementRequest request);
    Task<InventoryItemResponse> StockOutAsync(StockMovementRequest request);
    Task<InventoryItemResponse> AdjustStockAsync(AdjustStockRequest request);
    Task<List<InventoryItemResponse>> GetStockAsync(Guid? productId, Guid? warehouseId);
}