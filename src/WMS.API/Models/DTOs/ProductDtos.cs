using WMS.API.Models.Enums;
namespace WMS.API.Models.DTOs;

public record ProductResponse(
    Guid Id,
    string SKU,
    string Name,
    UnitOfMeasure UnitOfMeasure,
    decimal LowStockThreshold
);

public record UpdateProductRequest(
    string Name,
    UnitOfMeasure UnitOfMeasure,
    decimal LowStockThreshold
);

public record CreateProductRequest(
    string SKU,
    string Name,
    decimal LowStockThreshold,
    UnitOfMeasure UnitOfMeasure
);