using FluentValidation;
using WMS.API.Models.DTOs;

namespace WMS.API.Validators;


public class StockMovementRequestValidator : AbstractValidator<StockMovementRequest>
{
    public StockMovementRequestValidator()
    {
        RuleFor(x => x.ProductId)
        .NotEmpty().WithMessage("Product ID is required.");

        RuleFor(x => x.WarehouseId)
        .NotEmpty().WithMessage("Warehouse ID is required.");

        RuleFor(x => x.Quantity)
        .GreaterThan(0).WithMessage("Quantity Must Greater than ZERO");



        RuleFor(x => x.Reason).
        MaximumLength(500).WithMessage("Reason must not exceed 500 characters.");
    }

}