using WMS.API.Interfaces;
using WMS.API.Data;
using WMS.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using WMS.API.Models.Entities;
using WMS.API.Models.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WMS.API.Exceptions;
namespace WMS.API.Services;


public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IPasswordHasher<User> _hasher;
    private readonly ITokenService _tokenService;


    public AuthService(AppDbContext dbContext, IPasswordHasher<User> hasher, ITokenService tokenService)
    {
        _dbContext = dbContext;
        _hasher = hasher;
        _tokenService = tokenService;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        // Find by username
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

        if (user is null) return null;

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed) return null;

        var token = _tokenService.CreateToken(user);

        return new LoginResponse(token.Token, token.ExpiresAt, user.Username, user.Role.ToString());
    }

    public async Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request)
    {
        var _userExist = await _dbContext.Users.AnyAsync(u => u.Username == request.Username);

        if (_userExist)
        {
            throw new ConflictException("Username already exists.");
        }
        if (request.Role == UserRole.Admin)
        {
            throw new DomainException("Admin cannot create another Admin user.");
        }
        var newUser = new User
        {
            Username = request.Username,
            Role = request.Role,
        };
        newUser.PasswordHash = _hasher.HashPassword(newUser, request.Password);

        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();

        return new CreateUserResponse(newUser.Id, newUser.Username, newUser.Role.ToString(), newUser.IsActive);
    }

}