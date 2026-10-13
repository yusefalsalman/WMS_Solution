namespace WMS.API.Models.DTOs;

public record InventoryItemResponse(
    Guid Id,
    Guid ProductId,
    Guid WarehouseId,
    decimal Quantity,
    string ProductName,
    string WarehouseCode
);
public record StockMovementRequest(
    Guid ProductId,
    Guid WarehouseId,
    decimal Quantity,
    string? Reason
);
