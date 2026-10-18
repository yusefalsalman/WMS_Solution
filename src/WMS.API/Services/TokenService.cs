using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using WMS.API.Interfaces;
using WMS.API.Models.Entities;

namespace WMS.API.Services;

public class TokenService(IConfiguration config) : ITokenService
{
    public TokenResult CreateToken(User user)
    {
        var expiresAt = DateTime.UtcNow.AddMinutes(config.GetValue<int>("Jwt:ExpiresMinutes"));
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));

        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = config["Jwt:Issuer"],
            Audience = config["Jwt:Audience"],
            Expires = expiresAt,
            Subject = new ClaimsIdentity(
            [
                new Claim("sub", user.Id.ToString()),
                new Claim("unique_name", user.Username),
                new Claim("role", user.Role.ToString())
            ]),
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        };

        var token = new JsonWebTokenHandler().CreateToken(descriptor);
        return new TokenResult(token, expiresAt);
    }
}