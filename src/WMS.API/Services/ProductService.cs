using WMS.API.Interfaces;
using WMS.API.Data;
using WMS.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using WMS.API.Models.Entities;
namespace WMS.API.Services;


public class ProductService : IProductService
{
    private readonly AppDbContext _dbContext;

    public ProductService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private static ProductResponse MapToProductResponse(Product product)
    {
        return new ProductResponse(product.Id, product.SKU, product.Name, product.UnitOfMeasure, product.LowStockThreshold);
    }


    public async Task<PagedResponse<ProductResponse>> GetAllProductsAsync(int page, int pageSize)
    {
        var query = _dbContext.Products.AsNoTracking().Where(p => p.IsActive);

        var total = await query.CountAsync();

        var products = await query
        .OrderBy(p => p.Name)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

        return new PagedResponse<ProductResponse>(products.Select(MapToProductResponse).ToList(), page, pageSize, total);
    }
    public async Task<ProductResponse?> GetProductByIdAsync(Guid productId)
    {
        var product = await _dbContext.Products.FindAsync(productId);

        if (product == null)
        {
            return null;
        }

        return MapToProductResponse(product);
    }
    public async Task<ProductResponse> CreateProductAsync(CreateProductRequest request)
    {
        var product = new Product
        {
            SKU = request.SKU,
            Name = request.Name,
            UnitOfMeasure = request.UnitOfMeasure,
            LowStockThreshold = request.LowStockThreshold
        };

        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();

        return MapToProductResponse(product);
    }
    public async Task<ProductResponse?> UpdateProductAsync(Guid productId, UpdateProductRequest request)
    {
        var product = await _dbContext.Products.FindAsync(productId);

        if (product == null)
        {
            return null;
        }

        product.Name = request.Name;
        product.UnitOfMeasure = request.UnitOfMeasure;
        product.LowStockThreshold = request.LowStockThreshold;
        product.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return MapToProductResponse(product);
    }
    public async Task<bool> DeleteProductAsync(Guid productId)
    {
        var product = await _dbContext.Products.FindAsync(productId);

        if (product == null)
        {
            return false;
        }

        // _dbContext.Products.Remove(product);

        // soft delete 
        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;


        await _dbContext.SaveChangesAsync();

        return true;
    }
}