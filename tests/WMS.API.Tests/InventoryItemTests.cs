using WMS.API.Exceptions;
using WMS.API.Models.Entities;

namespace WMS.API.Tests;

public class InventoryItemTests
{
    [Fact]
    public void AddStock_PositiveQuantity_IncreasesStock()
    {
        var item = new InventoryItem();

        item.AddStock(5);

        Assert.Equal(5, item.Quantity);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void AddStock_NonPositiveQuantity_ThrowsArgumentException(decimal quantity)
    {
        var item = new InventoryItem();

        Assert.Throws<ArgumentException>(() => item.AddStock(quantity));
    }

    [Fact]
    public void RemoveStock_MoreThanAvailable_ThrowsInsufficientStockException()
    {
        var item = new InventoryItem();
        item.AddStock(3);

        Assert.Throws<InsufficientStockException>(() =>
            item.RemoveStock(4));
    }
}