using WMS.API.Models.Enums;

namespace WMS.API.Models.DTOs;


public record LoginRequest(
    string Username,
    string Password
);
public record LoginResponse(
    string Token,
    DateTime ExpiresAt,
    string Username,
    string Role
);

public record CreateUserRequest(
    string Username,
    string Password,
    UserRole Role
);

public record CreateUserResponse(
    Guid Id,
    string Username,
    string Role,
    bool IsActive
);
