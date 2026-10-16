using WMS.API.Models.Enums;

namespace WMS.API.Models.Entities;


public class StockTransfer : BaseEntity
{
    public Guid ProductId { get; private set; }
    public Guid FromWarehouseId { get; private set; }
    public Guid ToWarehouseId { get; private set; }
    public decimal Quantity { get; private set; }
    public TransferStatus Status { get; private set; }

    public StockTransfer(Guid productId, Guid fromWarehouseId, Guid toWarehouseId, decimal quantity)
    {
        ProductId = productId;
        if (fromWarehouseId == toWarehouseId)
        {
            throw new ArgumentException("FromWarehouseId and ToWarehouseId cannot be the same.");
        }
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.");
        }
        FromWarehouseId = fromWarehouseId;
        ToWarehouseId = toWarehouseId;
        Quantity = quantity;
        Status = TransferStatus.Pending;
    }

    public void Complete()
    {
        Status = TransferStatus.Completed;
        UpdatedAt = DateTime.UtcNow;
    }
    // Navigation properties
    public Product Product { get; set; } = null!;
    public Warehouse FromWarehouse { get; set; } = null!;
    public Warehouse ToWarehouse { get; set; } = null!;
}