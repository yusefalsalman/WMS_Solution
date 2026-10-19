namespace WMS.API.Models.Entities;

public class LowStockAlert : BaseEntity
{
    public Guid InventoryItemId { get; set; }

    public decimal QuantityAtDetection { get; set; }
    public decimal ThresholdAtDetection { get; set; }

    public DateTime DetectedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? ResolvedAt { get; set; }

    public InventoryItem InventoryItem { get; set; } = null!;
}