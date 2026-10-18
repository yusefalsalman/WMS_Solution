using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WMS.API.Models.Entities;
namespace WMS.API.Data.Configurations;


public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.HasOne(a => a.Product)
            .WithMany()
            .HasForeignKey(a => a.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Warehouse)
            .WithMany()
            .HasForeignKey(a => a.WarehouseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(a => a.Reason)
            .HasMaxLength(500);

        builder.Property(a => a.QuantityChanged)
            .HasPrecision(18, 3);

        builder.Property(a => a.QuantityAfter)
            .HasPrecision(18, 3);

        builder.Property(a => a.MovementType)
            .HasConversion<string>();
    }
}