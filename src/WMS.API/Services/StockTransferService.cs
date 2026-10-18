using WMS.API.Interfaces;
using WMS.API.Data;
using WMS.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using WMS.API.Models.Entities;
using WMS.API.Exceptions;
using WMS.API.Models.Enums;
namespace WMS.API.Services;

public class StockTransferService : IStockTransferService
{

    private readonly AppDbContext _dbContext;

    public StockTransferService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<StockTransferResponse> CreateTransferAsync(CreateStockTransferRequest request, Guid userId)
    {
        var product = await _dbContext.Products.FindAsync(request.ProductId);
        var toWarehouse = await _dbContext.Warehouses.FindAsync(request.ToWarehouseId);
        var fromWarehouse = await _dbContext.Warehouses.FindAsync(request.FromWarehouseId);

        if (product is null || !product.IsActive) throw new NotFoundException("The Product Not Found");
        if (toWarehouse is null || !toWarehouse.IsActive) throw new NotFoundException("Destination warehouse not found");
        if (fromWarehouse is null || !fromWarehouse.IsActive) throw new NotFoundException("Source warehouse not found");
        if (fromWarehouse.Id == toWarehouse.Id) throw new DomainException("Can't Transfer to Same Warehouse");

        // -------------------------- Transaction

        // 2. Start the transaction
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();


        // 3. Lock both stock rows (FOR UPDATE) in a fixed order to avoid deadlocks:
        //    A->Z and Z->A both lock the smaller warehouse id first.
        var firstId = fromWarehouse.Id.CompareTo(toWarehouse.Id) < 0 ? fromWarehouse.Id : toWarehouse.Id;
        var secondId = firstId == fromWarehouse.Id ? toWarehouse.Id : fromWarehouse.Id;

        var firstItem = await LockStockRowAsync(product.Id, firstId);
        var secondItem = await LockStockRowAsync(product.Id, secondId);

        var sourceItem = firstId == fromWarehouse.Id ? firstItem : secondItem;
        var destItem = firstId == fromWarehouse.Id ? secondItem : firstItem;

        // 4. Take from the source
        if (sourceItem is null) throw new InsufficientStockException(request.Quantity, 0);

        sourceItem.RemoveStock(request.Quantity);

        // 5. Add to the destination
        if (destItem is null)
        {
            destItem = new InventoryItem { ProductId = product.Id, WarehouseId = toWarehouse.Id };
            _dbContext.InventoryItems.Add(destItem);
        }

        destItem.AddStock(request.Quantity);

        // 5. The transfer record
        var transfer = new StockTransfer(product.Id, fromWarehouse.Id, toWarehouse.Id, request.Quantity);
        transfer.Complete();
        _dbContext.StockTransfers.Add(transfer);

        // 6. Two audit logs
        _dbContext.AuditLogs.Add(new AuditLog(product.Id, fromWarehouse.Id, userId, MovementType.TransferOut,
            -request.Quantity, sourceItem.Quantity, $"Transfer to {toWarehouse.Code}"));
        _dbContext.AuditLogs.Add(new AuditLog(product.Id, toWarehouse.Id, userId, MovementType.TransferIn,
            request.Quantity, destItem.Quantity, $"Transfer from {fromWarehouse.Code}"));

        // 7. Save + commit
        await _dbContext.SaveChangesAsync();
        await transaction.CommitAsync();

        // 8. Response
        return new StockTransferResponse(transfer.Id, transfer.ProductId, transfer.FromWarehouseId,
            transfer.ToWarehouseId, transfer.Quantity, transfer.Status);
    }

    // Reads one stock row and locks it until the transaction ends.
    // xmin is selected explicitly because SELECT * skips system columns.
    private Task<InventoryItem?> LockStockRowAsync(Guid productId, Guid warehouseId)
    {
        return _dbContext.InventoryItems
            .FromSql($"""
                SELECT *, xmin FROM "InventoryItems"
                WHERE "ProductId" = {productId} AND "WarehouseId" = {warehouseId}
                FOR UPDATE
                """)
            .FirstOrDefaultAsync();
    }

    public async Task<List<StockTransferResponse>> GetTransfersAsync()
    {
        return await _dbContext.StockTransfers
            .AsNoTracking()
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new StockTransferResponse(t.Id, t.ProductId, t.FromWarehouseId,
                t.ToWarehouseId, t.Quantity, t.Status))
            .ToListAsync();
    }

}
