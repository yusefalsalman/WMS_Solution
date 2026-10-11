using WMS.API.Models.Enums;

namespace WMS.API.Models.Entities;


public class AuditLog : BaseEntity
{
    public Guid ProductId { get; private set; }
    public Guid WarehouseId { get; private set; }
    public MovementType MovementType { get; private set; }
    public decimal QuantityChanged { get; private set; }
    public decimal QuantityAfter { get; private set; }
    public string? Reason { get; private set; }

    // Navigation properties
    public Product Product { get; set; } = null!;
    public Warehouse Warehouse { get; set; } = null!;

    public AuditLog(Guid productId, Guid warehouseId, MovementType movementType, decimal quantityChanged, decimal quantityAfter, string? reason = null)
    {
        ProductId = productId;
        WarehouseId = warehouseId;
        MovementType = movementType;
        if (quantityChanged == 0)
        {
            throw new ArgumentException("Quantity changed cannot be zero.", nameof(quantityChanged));
        }
        QuantityChanged = quantityChanged;
        QuantityAfter = quantityAfter;
        Reason = reason;
    }
}