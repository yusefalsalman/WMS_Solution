using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WMS.API.Models.Entities;

namespace WMS.API.Data.Configurations;

public class LowStockAlertConfiguration : IEntityTypeConfiguration<LowStockAlert>
{
    public void Configure(EntityTypeBuilder<LowStockAlert> builder)
    {
        builder.HasOne(alert => alert.InventoryItem)
            .WithMany()
            .HasForeignKey(alert => alert.InventoryItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(alert => alert.InventoryItemId)
            .IsUnique();

        builder.Property(alert => alert.QuantityAtDetection)
            .HasPrecision(18, 3);

        builder.Property(alert => alert.ThresholdAtDetection)
            .HasPrecision(18, 3);
    }
}