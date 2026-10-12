using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WMS.API.Models.Entities;
namespace WMS.API.Data.Configurations;


public class WarehouseConfiguration : IEntityTypeConfiguration<Warehouse>
{
    public void Configure(EntityTypeBuilder<Warehouse> builder)
    {
        builder.HasIndex(w => w.Code).IsUnique();

        builder.Property(w => w.Code)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(w => w.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(w => w.Location)
            .IsRequired()
            .HasMaxLength(300);
    }
}