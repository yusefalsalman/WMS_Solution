namespace WMS.API.Models.DTOs;

public record LowStockAlertResponse(
    Guid Id,
    string Sku,
    string ProductName,
    string WarehouseCode,
    decimal CurrentQuantity,
    decimal ThresholdAtDetection,
    DateTime DetectedAt
);