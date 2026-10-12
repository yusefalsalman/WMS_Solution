using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WMS.API.Models.Entities;
namespace WMS.API.Data.Configurations;


public class StockTransferConfiguration : IEntityTypeConfiguration<StockTransfer>
{
    public void Configure(EntityTypeBuilder<StockTransfer> builder)
    {
        builder.HasOne(t => t.FromWarehouse)
        .WithMany()
        .HasForeignKey(t => t.FromWarehouseId)
        .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.ToWarehouse)
        .WithMany()
        .HasForeignKey(t => t.ToWarehouseId)
        .OnDelete(DeleteBehavior.Restrict);

        builder.Property(s => s.Quantity)
            .HasPrecision(18, 3);

        builder.Property(s => s.Status)
            .HasConversion<string>();
    }
}