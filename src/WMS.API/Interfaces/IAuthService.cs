using WMS.API.Models.DTOs;
namespace WMS.API.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request);
}