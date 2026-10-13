using WMS.API.Models.Enums;

namespace WMS.API.Models.DTOs;

public record StockTransferResponse(
    Guid Id,
    Guid ProductId,
    Guid FromWarehouseId,
    Guid ToWarehouseId,
    decimal Quantity,
    TransferStatus Status
);

public record CreateStockTransferRequest(
    Guid ProductId,
    Guid FromWarehouseId,
    Guid ToWarehouseId,
    decimal Quantity
);

