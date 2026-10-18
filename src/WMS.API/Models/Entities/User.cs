using WMS.API.Models.Enums;

namespace WMS.API.Models.Entities;


public class User : BaseEntity
{
    public required string Username { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Clerk;
    public bool IsActive { get; set; } = true;
}