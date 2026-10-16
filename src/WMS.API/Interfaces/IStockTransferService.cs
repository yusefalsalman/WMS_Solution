using WMS.API.Models.DTOs;
namespace WMS.API.Interfaces;


public interface IStockTransferService
{
    Task<StockTransferResponse> CreateTransferAsync(CreateStockTransferRequest request);
    Task<List<StockTransferResponse>> GetTransfersAsync();
}