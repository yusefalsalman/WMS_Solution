using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using WMS.API.Exceptions;

namespace WMS.API.Middlewares;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        var (status, title) = exception switch
        {
            DbUpdateException { InnerException: PostgresException { SqlState: "23505" } }
                => (409, "A record with the same unique value already exists."),
            DbUpdateException { InnerException: PostgresException { SqlState: "23503" } }
                => (409, "This record is used by other records and cannot be deleted."),
            InsufficientStockException e => (409, e.Message),
            DomainException e => (400, e.Message),
            ArgumentException e => (400, e.Message),
            _ => (500, "An unexpected error occurred.")
        };

        if (status == 500) logger.LogError(exception, "Unhandled exception");

        context.Response.StatusCode = status;
        await context.Response.WriteAsJsonAsync(new ProblemDetails { Status = status, Title = title }, ct);
        return true;
    }
}