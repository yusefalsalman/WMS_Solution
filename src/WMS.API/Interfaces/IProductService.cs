using WMS.API.Models.DTOs;
namespace WMS.API.Interfaces;

public interface IProductService
{
    Task<PagedResponse<ProductResponse>> GetAllProductsAsync(int page, int pageSize);
    Task<ProductResponse?> GetProductByIdAsync(Guid productId);
    Task<ProductResponse> CreateProductAsync(CreateProductRequest request);
    Task<ProductResponse?> UpdateProductAsync(Guid productId, UpdateProductRequest request);
    Task<bool> DeleteProductAsync(Guid productId);
}