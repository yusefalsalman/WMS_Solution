using WMS.API.Interfaces;
using WMS.API.Data;
using WMS.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using WMS.API.Models.Entities;
using WMS.API.Exceptions;
using WMS.API.Models.Enums;
namespace WMS.API.Services;

public class InventoryService : IInventoryService
{
    private readonly AppDbContext _dbContext;

    public InventoryService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<InventoryItemResponse> StockInAsync(StockMovementRequest request)
    {
        var product = await _dbContext.Products.FindAsync(request.ProductId);
        var warehouse = await _dbContext.Warehouses.FindAsync(request.WarehouseId);

        if (product is null || !product.IsActive)
        {
            throw new NotFoundException("The Product Not Found");
        }
        if (warehouse is null || !warehouse.IsActive)
        {
            throw new NotFoundException("The warehouse Not Found");
        }

        var item = await _dbContext.InventoryItems.FirstOrDefaultAsync(i => i.ProductId == product.Id && i.WarehouseId == warehouse.Id);

        if (item is null)
        {
            item = new InventoryItem { ProductId = request.ProductId, WarehouseId = request.WarehouseId };
            _dbContext.InventoryItems.Add(item);
        }

        item.AddStock(request.Quantity);

        // Create Audit Log
        _dbContext.AuditLogs.Add(new AuditLog(request.ProductId, request.WarehouseId, MovementType.StockIn, request.Quantity, item.Quantity, request.Reason));

        await _dbContext.SaveChangesAsync();
        return new InventoryItemResponse(
            item.Id,
            item.ProductId,
            item.WarehouseId,
            item.Quantity,
            product.Name,
            warehouse.Code
        );
    }

    public async Task<InventoryItemResponse> StockOutAsync(StockMovementRequest request)
    {
        var product = await _dbContext.Products.FindAsync(request.ProductId);
        var warehouse = await _dbContext.Warehouses.FindAsync(request.WarehouseId);

        if (product is null || !product.IsActive)
        {
            throw new NotFoundException("The Product Not Found");
        }
        if (warehouse is null || !warehouse.IsActive)
        {
            throw new NotFoundException("The warehouse Not Found");
        }

        var item = await _dbContext.InventoryItems.FirstOrDefaultAsync(i => i.ProductId == product.Id && i.WarehouseId == warehouse.Id);

        // No stock row means nothing to remove
        if (item is null)
        {
            throw new InsufficientStockException(request.Quantity, 0);
        }

        item.RemoveStock(request.Quantity);

        // Create Audit Log (negative change for stock out)
        _dbContext.AuditLogs.Add(new AuditLog(request.ProductId, request.WarehouseId, MovementType.StockOut, -request.Quantity, item.Quantity, request.Reason));

        await _dbContext.SaveChangesAsync();
        return new InventoryItemResponse(
            item.Id,
            item.ProductId,
            item.WarehouseId,
            item.Quantity,
            product.Name,
            warehouse.Code
        );
    }


    public async Task<InventoryItemResponse> AdjustStockAsync(AdjustStockRequest request)
    {
        var product = await _dbContext.Products.FindAsync(request.ProductId);
        var warehouse = await _dbContext.Warehouses.FindAsync(request.WarehouseId);

        if (product is null || !product.IsActive)
        {
            throw new NotFoundException("The Product Not Found");
        }
        if (warehouse is null || !warehouse.IsActive)
        {
            throw new NotFoundException("The warehouse Not Found");
        }

        var item = await _dbContext.InventoryItems.FirstOrDefaultAsync(i => i.ProductId == product.Id && i.WarehouseId == warehouse.Id);

        if (item is null)
        {
            item = new InventoryItem { ProductId = product.Id, WarehouseId = warehouse.Id };
            _dbContext.InventoryItems.Add(item);
        }

        var difference = request.NewQuantity - item.Quantity;

        if (difference == 0) throw new DomainException("No change in quantity.");

        item.AdjustTo(request.NewQuantity);

        _dbContext.AuditLogs.Add(new AuditLog(request.ProductId, request.WarehouseId, MovementType.Adjustment, difference, item.Quantity, request.Reason));

        await _dbContext.SaveChangesAsync();

        return new InventoryItemResponse(
            item.Id,
            item.ProductId,
            item.WarehouseId,
            item.Quantity,
            product.Name,
            warehouse.Code
        );
    }

    public async Task<List<InventoryItemResponse>> GetStockAsync(Guid? productId, Guid? warehouseId)
    {
        var query = _dbContext.InventoryItems.AsNoTracking();

        // Filters are optional: only applied when sent
        if (productId is not null) query = query.Where(i => i.ProductId == productId);
        if (warehouseId is not null) query = query.Where(i => i.WarehouseId == warehouseId);

        // Product.Name and Warehouse.Code inside Select make EF generate a JOIN
        return await query
            .Select(i => new InventoryItemResponse(
                i.Id,
                i.ProductId,
                i.WarehouseId,
                i.Quantity,
                i.Product.Name,
                i.Warehouse.Code))
            .ToListAsync();
    }
}