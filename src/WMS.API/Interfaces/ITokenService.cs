using WMS.API.Models.Entities;

namespace WMS.API.Interfaces;

public record TokenResult(
    string Token,
    DateTime ExpiresAt
);

public interface ITokenService
{
    TokenResult CreateToken(User user);
}