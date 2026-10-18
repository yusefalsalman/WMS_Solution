using Dapper;
using Microsoft.EntityFrameworkCore;
using WMS.API.Data;
using WMS.API.Interfaces;
using WMS.API.Models.DTOs;


public class ReportService : IReportService
{
    private readonly AppDbContext _dbContext;

    public ReportService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<WarehouseStockSummary>> GetStockByWarehouseAsync()
    {
        const string sql = """
            SELECT
                w."Code"                         AS "WarehouseCode",
                w."Name"                         AS "WarehouseName",
                COUNT(i."Id")                    AS "ProductCount",
                COALESCE(SUM(i."Quantity"), 0)   AS "TotalQuantity"
            FROM "Warehouses" w
            LEFT JOIN "InventoryItems" i ON i."WarehouseId" = w."Id"
            WHERE w."IsActive" = TRUE
            GROUP BY w."Id", w."Code", w."Name"
            ORDER BY w."Code";
            """;

        var connection = _dbContext.Database.GetDbConnection();
        var result = await connection.QueryAsync<WarehouseStockSummary>(sql);
        return result.ToList();
    }

    public async Task<List<LowStockItem>> GetLowStockAsync(Guid? warehouseId)
    {
        const string sql = """
        SELECT
            p."SKU"                 AS "Sku",
            p."Name"                AS "ProductName",
            w."Code"                AS "WarehouseCode",
            i."Quantity"            AS "Quantity",
            p."LowStockThreshold"   AS "LowStockThreshold"
        FROM "InventoryItems" i
        JOIN "Products"   p ON p."Id" = i."ProductId"
        JOIN "Warehouses" w ON w."Id" = i."WarehouseId"
        WHERE i."Quantity" < p."LowStockThreshold"
            AND p."IsActive" = TRUE
            AND w."IsActive" = TRUE
            AND (CAST(@WarehouseId AS uuid) IS NULL OR i."WarehouseId" = @WarehouseId)
        ORDER BY (i."Quantity" / NULLIF(p."LowStockThreshold", 0)), p."Name";
        """;

        var connection = _dbContext.Database.GetDbConnection();
        var result = await connection.QueryAsync<LowStockItem>(sql, new { WarehouseId = warehouseId });
        return result.ToList();

    }

    public async Task<List<AuditLogEntry>> GetAuditLogAsync(Guid? productId, Guid? warehouseId, DateTime? from, DateTime? to)
    {
        // Every filter is optional: "param IS NULL OR condition" skips it when not sent.
        const string sql = """
            SELECT
                a."CreatedAt"        AS "CreatedAt",
                p."SKU"              AS "Sku",
                w."Code"             AS "WarehouseCode",
                a."MovementType"     AS "MovementType",
                a."QuantityChanged"  AS "QuantityChanged",
                a."QuantityAfter"    AS "QuantityAfter",
                a."Reason"           AS "Reason"
            FROM "AuditLogs" a
            JOIN "Products"   p ON p."Id" = a."ProductId"
            JOIN "Warehouses" w ON w."Id" = a."WarehouseId"
            WHERE (CAST(@ProductId   AS uuid)        IS NULL OR a."ProductId"   = @ProductId)
                AND (CAST(@WarehouseId AS uuid)        IS NULL OR a."WarehouseId" = @WarehouseId)
                AND (CAST(@From        AS timestamptz) IS NULL OR a."CreatedAt"  >= @From)
                AND (CAST(@To          AS timestamptz) IS NULL OR a."CreatedAt"  <  @To)
            ORDER BY a."CreatedAt" DESC
            LIMIT 500;
            """;

        // Dates from the query string have no time zone; Postgres timestamptz needs UTC.
        var parameters = new
        {
            ProductId = productId,
            WarehouseId = warehouseId,
            From = from.HasValue ? DateTime.SpecifyKind(from.Value, DateTimeKind.Utc) : (DateTime?)null,
            To = to.HasValue ? DateTime.SpecifyKind(to.Value, DateTimeKind.Utc) : (DateTime?)null
        };

        var connection = _dbContext.Database.GetDbConnection();
        var result = await connection.QueryAsync<AuditLogEntry>(sql, parameters);
        return result.ToList();
    }
}