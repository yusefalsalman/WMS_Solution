using WMS.API.Interfaces;
using WMS.API.Data;
using WMS.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using WMS.API.Models.Entities;
namespace WMS.API.Services;


public class WarehouseService : IWarehouseService
{
    private readonly AppDbContext _dbContext;

    public WarehouseService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private static WarehouseResponse MapToWarehouseResponse(Warehouse warehouse)
    {
        return new WarehouseResponse(warehouse.Id, warehouse.Code, warehouse.Name, warehouse.Location, warehouse.IsActive);
    }

    public async Task<PagedResponse<WarehouseResponse>> GetAllWarehousesAsync(int page, int pageSize)
    {
        var query = _dbContext.Warehouses.AsNoTracking().Where(w => w.IsActive);

        var total = await query.CountAsync();


        var warehouses = await _dbContext.Warehouses
        .OrderBy(w => w.Name)
        .Skip((page - 1) * pageSize)
        .Take(pageSize).ToListAsync();

        return new PagedResponse<WarehouseResponse>(warehouses.Select(MapToWarehouseResponse).ToList(), page, pageSize, total);
    }

    public async Task<WarehouseResponse?> GetWarehouseByIdAsync(Guid warehouseId)
    {
        var warehouse = await _dbContext.Warehouses.FindAsync(warehouseId);

        if (warehouse == null)
        {
            return null;
        }

        return MapToWarehouseResponse(warehouse);
    }

    public async Task<WarehouseResponse> CreateWarehouseAsync(CreateWarehouseRequest request)
    {
        var warehouse = new Warehouse
        {
            Code = request.Code,
            Name = request.Name,
            Location = request.Location,
        };

        _dbContext.Warehouses.Add(warehouse);
        await _dbContext.SaveChangesAsync();

        return MapToWarehouseResponse(warehouse);
    }

    public async Task<WarehouseResponse?> UpdateWarehouseAsync(Guid warehouseId, UpdateWarehouseRequest request)
    {
        var warehouse = await _dbContext.Warehouses.FindAsync(warehouseId);

        if (warehouse == null)
        {
            return null;
        }

        warehouse.Name = request.Name;
        warehouse.Location = request.Location;
        warehouse.IsActive = request.IsActive;
        warehouse.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return MapToWarehouseResponse(warehouse);
    }

    public async Task<bool> DeleteWarehouseAsync(Guid warehouseId)
    {
        var warehouse = await _dbContext.Warehouses.FindAsync(warehouseId);

        if (warehouse == null)
        {
            return false;
        }

        // _dbContext.Warehouses.Remove(warehouse);

        warehouse.IsActive = false;
        warehouse.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return true;
    }
}