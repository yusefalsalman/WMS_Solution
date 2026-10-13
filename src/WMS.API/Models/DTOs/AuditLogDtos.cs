using WMS.API.Models.Enums;

namespace WMS.API.Models.DTOs;

public record AuditLogResponse(
    Guid Id,
    Guid ProductId,
    Guid WarehouseId,
    DateTime CreatedAt,
    MovementType MovementType,
    decimal QuantityChanged,
    decimal QuantityAfter,
    string? Reason
);