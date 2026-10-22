using WMS.API.Models.Entities;
using WMS.API.Models.Enums;

namespace WMS.API.Tests;

public class StockTransferTests
{
    [Fact]
    public void Constructor_SameWarehouse_ThrowsArgumentException()
    {
        var warehouseId = Guid.NewGuid();

        Assert.Throws<ArgumentException>(() =>
        new StockTransfer(
            Guid.NewGuid(),
            warehouseId,
            warehouseId,
            1
        ));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-2)]
    public void Constructor_NonPositiveQuantity_ThrowsArgumentException(decimal quantity)
    {
        Assert.Throws<ArgumentException>(() =>
        new StockTransfer(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            quantity
        ));
    }

    [Fact]
    public void Complete_PendingTransfer_ChangesStatusToCompleted()
    {
        var transfer = new StockTransfer(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            5
        );

        transfer.Complete();

        Assert.Equal(TransferStatus.Completed, transfer.Status);
    }

}