namespace WMS.API.Models.DTOs;

public record WarehouseResponse(
    Guid Id,
    string Code,
    string Name,
    string Location,
    bool IsActive
);

public record CreateWarehouseRequest(
    string Code,
    string Name,
    string Location
);

public record UpdateWarehouseRequest(
    string Name,
    string Location,
    bool IsActive
);