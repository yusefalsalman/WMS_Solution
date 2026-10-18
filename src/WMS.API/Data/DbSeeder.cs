using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WMS.API.Models.Entities;
using WMS.API.Models.Enums;

namespace WMS.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, IPasswordHasher<User> hasher, string? adminPassword)
    {
        // Users: separate check, so it runs even when products already exist
        if (!await db.Users.AnyAsync() && !string.IsNullOrWhiteSpace(adminPassword))
        {
            var admin = new User { Username = "admin", Role = UserRole.Admin };
            admin.PasswordHash = hasher.HashPassword(admin, adminPassword);
            db.Users.Add(admin);
            await db.SaveChangesAsync();
        }

        // 0- check if the database is empty
        if (await db.Warehouses.AnyAsync() || await db.Products.AnyAsync()) return;

        // 1- create some warehouses
        var amman = new Warehouse { Code = "AMM-01", Name = "Amman Main Warehouse", Location = "Amman" };
        var zarqa = new Warehouse { Code = "ZRQ-01", Name = "Zarqa Warehouse", Location = "Zarqa" };

        // 2- create some products
        var cups = new Product { SKU = "CUP-250-WHT", Name = "Plastic Cup 250ml White", UnitOfMeasure = UnitOfMeasure.Piece, LowStockThreshold = 100 };
        var rice = new Product { SKU = "RICE-5KG", Name = "Rice 5kg Bag", UnitOfMeasure = UnitOfMeasure.Kilogram, LowStockThreshold = 50 };
        var oil = new Product { SKU = "OIL-1L", Name = "Olive Oil 1L", UnitOfMeasure = UnitOfMeasure.Liter, LowStockThreshold = 30 };

        // 3- create some inventory items
        InventoryItem Stock(Product product, Warehouse warehouse, decimal quantity)
        {
            var item = new InventoryItem { Product = product, Warehouse = warehouse };
            item.AddStock(quantity);
            return item;
        }

        // 4- add them to the database
        db.Warehouses.AddRange(amman, zarqa);
        db.Products.AddRange(cups, rice, oil);
        db.InventoryItems.AddRange(
            Stock(cups, amman, 500),
            Stock(cups, zarqa, 200),
            Stock(rice, amman, 120.5m),
            Stock(oil, zarqa, 40));

        await db.SaveChangesAsync();
    }
}