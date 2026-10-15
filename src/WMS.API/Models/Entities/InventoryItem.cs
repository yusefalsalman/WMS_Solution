using WMS.API.Exceptions;

namespace WMS.API.Models.Entities;

public class InventoryItem : BaseEntity
{
    public Guid ProductId { get; set; }
    public Guid WarehouseId { get; set; }
    public decimal Quantity { get; private set; }

    // Navigation properties
    public Product Product { get; set; } = null!;
    public Warehouse Warehouse { get; set; } = null!;


    public void AddStock(decimal quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));
        }
        Quantity += quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveStock(decimal quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));
        }
        if (quantity > Quantity)
        {
            throw new InsufficientStockException(quantity, Quantity);
        }
        Quantity -= quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AdjustTo(decimal newQuantity)
    {
        if (newQuantity < 0)
        {
            throw new ArgumentException("Quantity must be greater than or equal zero.", nameof(newQuantity));
        }

        Quantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }

}