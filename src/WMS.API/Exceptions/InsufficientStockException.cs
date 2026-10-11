namespace WMS.API.Exceptions;

public class InsufficientStockException : DomainException
{
    public decimal Requested { get; }
    public decimal Available { get; }

    public InsufficientStockException(decimal requested, decimal available) : base($"Insufficient stock available. Requested: {requested}, Available: {available}")
    {
        Requested = requested;
        Available = available;
    }
}