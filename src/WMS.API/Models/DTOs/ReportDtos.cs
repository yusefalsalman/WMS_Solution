namespace WMS.API.Models.DTOs;

public record WarehouseStockSummary(
    string WarehouseCode,
    string WarehouseName,
    long ProductCount,
    decimal TotalQuantity
);

public record LowStockItem(
    string Sku,
    string ProductName,
    string WarehouseCode,
    decimal Quantity,
    decimal LowStockThreshold
);

public record AuditLogEntry(
    DateTime CreatedAt,
    string Sku,
    string WarehouseCode,
    string MovementType,
    decimal QuantityChanged,
    decimal QuantityAfter,
    string? Reason
);