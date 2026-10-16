using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WMS.API.Models.Entities;
namespace WMS.API.Data.Configurations;


public class InventoryItemConfiguration : IEntityTypeConfiguration<InventoryItem>
{
    public void Configure(EntityTypeBuilder<InventoryItem> builder)
    {
        builder.HasIndex(i => new { i.WarehouseId, i.ProductId }).IsUnique();

        builder.Property(i => i.Quantity)
            .HasPrecision(18, 3);

        builder.Property(i => i.Version).IsRowVersion();
    }
}