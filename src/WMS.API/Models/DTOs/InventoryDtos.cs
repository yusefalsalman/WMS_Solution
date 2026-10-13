namespace WMS.API.Models.DTOs;

public record StockMovementRequest(
    Guid ProductId,
    Guid WarehouseId,
    decimal Quantity,
    string? Reason
);

public record InventoryItemResponse(
    Guid Id,
    Guid ProductId,
    Guid WarehouseId,
    string ProductName,
    string WarehouseCode,
    decimal Quantity
);