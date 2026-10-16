using FluentValidation;
using WMS.API.Models.DTOs;

namespace WMS.API.Validators;

public class CreateStockTransferRequestValidator : AbstractValidator<CreateStockTransferRequest>
{
    public CreateStockTransferRequestValidator()
    {
        RuleFor(x => x.ProductId)
        .NotEmpty().WithMessage("Product ID is required.");

        RuleFor(x => x.FromWarehouseId)
        .NotEmpty().WithMessage("Warehouse ID is required.");

        RuleFor(x => x.ToWarehouseId)
        .NotEmpty().WithMessage("Warehouse ID is required.")
        .NotEqual(x => x.FromWarehouseId);

        RuleFor(x => x.Quantity)
        .GreaterThan(0).WithMessage("Quantity Must Greater than ZERO");
    }
}