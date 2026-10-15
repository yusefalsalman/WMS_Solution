using FluentValidation;
using WMS.API.Models.DTOs;

namespace WMS.API.Validators;


public class AdjustStockRequestValidator : AbstractValidator<AdjustStockRequest>
{
    public AdjustStockRequestValidator()
    {
        RuleFor(x => x.ProductId)
        .NotEmpty().WithMessage("Product ID is required.");

        RuleFor(x => x.WarehouseId)
        .NotEmpty().WithMessage("Warehouse ID is required.");

        RuleFor(x => x.NewQuantity)
        .GreaterThanOrEqualTo(0).WithMessage("Quantity Must Greater than or equal ZERO");

        RuleFor(x => x.Reason)
        .NotEmpty().WithMessage("Reason Is Required")
        .MaximumLength(500);
    }
}