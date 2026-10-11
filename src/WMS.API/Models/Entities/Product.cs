using WMS.API.Models.Enums;

namespace WMS.API.Models.Entities;

public class Product : BaseEntity
{
    public required string SKU { get; set; }
    public required string Name { get; set; }
    public UnitOfMeasure UnitOfMeasure { get; set; }
    public decimal LowStockThreshold { get; set; }
}