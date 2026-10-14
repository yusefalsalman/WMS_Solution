using FluentValidation;
using WMS.API.Models.DTOs;

namespace WMS.API.Validators;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.SKU)
        .NotEmpty().WithMessage("SKU is required.")
        .MaximumLength(50).WithMessage("SKU cannot exceed 50 characters.");

        RuleFor(x => x.Name)
        .NotEmpty().WithMessage("Name is required.")
        .MaximumLength(500).WithMessage("Name cannot exceed 500 characters.");

        RuleFor(x => x.UnitOfMeasure)
        .IsInEnum().WithMessage("Unit Of Measure is not a valid, must be one of the following: Each, Kilogram, Liter, Meter.");

        RuleFor(x => x.LowStockThreshold)
        .GreaterThanOrEqualTo(0).WithMessage("Low Stock Threshold must be greater than or equal to 0.");
    }
}

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(500);

        RuleFor(x => x.UnitOfMeasure)
            .IsInEnum().WithMessage("Unit of measure is not valid, must be one of the following: Each, Kilogram, Liter, Meter.");

        RuleFor(x => x.LowStockThreshold)
            .GreaterThanOrEqualTo(0).WithMessage("Low stock threshold cannot be negative.");
    }
}