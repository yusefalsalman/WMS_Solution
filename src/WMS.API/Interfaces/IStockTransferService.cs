using WMS.API.Models.DTOs;
namespace WMS.API.Interfaces;


public interface IStockTransferService
{
    Task<StockTransferResponse> CreateTransferAsync(CreateStockTransferRequest request, Guid userId);
    Task<List<StockTransferResponse>> GetTransfersAsync();
}
