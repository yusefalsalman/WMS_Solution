using WMS.API.Models.Enums;

namespace WMS.API.Models.Entities;

public class Product : BaseEntity
{
    public required string SKU { get; set; }
    public required string Name { get; set; }
    public required UnitOfMeasure UnitOfMeasure { get; set; }
    public required decimal LowStockThreshold { get; set; }
    public bool IsActive { get; set; } = true;
}