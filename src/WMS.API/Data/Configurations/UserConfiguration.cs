using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WMS.API.Models.Entities;
namespace WMS.API.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(x => x.Username).IsUnique();

        builder.Property(x => x.Username).IsRequired().HasMaxLength(50);

        builder.Property(x => x.PasswordHash).IsRequired().HasMaxLength(200);

        builder.Property(x => x.Role).HasConversion<string>();
    }
}