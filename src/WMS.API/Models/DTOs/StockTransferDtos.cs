using WMS.API.Models.Enums;

namespace WMS.API.Models.DTOs;


public record CreateStockTransferRequest(
    Guid FromWarehouseId,
    Guid ToWarehouseId,
    Guid ProductId,
    decimal Quantity
);

public record StockTransferResponse(
    Guid Id,
    Guid FromWarehouseId,
    Guid ToWarehouseId,
    Guid ProductId,
    decimal Quantity,
    TransferStatus Status
);