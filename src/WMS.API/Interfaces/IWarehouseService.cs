using WMS.API.Models.DTOs;
namespace WMS.API.Interfaces;

public interface IWarehouseService
{
    Task<PagedResponse<WarehouseResponse>> GetAllWarehousesAsync(int page, int pageSize);
    Task<WarehouseResponse?> GetWarehouseByIdAsync(Guid warehouseId);
    Task<WarehouseResponse> CreateWarehouseAsync(CreateWarehouseRequest request);
    Task<WarehouseResponse?> UpdateWarehouseAsync(Guid warehouseId, UpdateWarehouseRequest request);
    Task<bool> DeleteWarehouseAsync(Guid warehouseId);
}