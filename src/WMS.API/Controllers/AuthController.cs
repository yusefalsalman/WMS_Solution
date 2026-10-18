using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using WMS.API.Interfaces;
using WMS.API.Models.DTOs;

namespace WMS.API.Controllers;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginRequest request,
        [FromServices] IValidator<LoginRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
            return ValidationProblem(new ValidationProblemDetails(validationResult.ToDictionary()));

        var result = await _authService.LoginAsync(request);

        if (result is null)
            return Unauthorized(new { message = "Invalid username or password." });

        return Ok(result);
    }

    [HttpPost("Register")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CreateUserResponse>> CreateUser(
        CreateUserRequest request,
        [FromServices] IValidator<CreateUserRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
            return ValidationProblem(new ValidationProblemDetails(validationResult.ToDictionary()));

        var result = await _authService.CreateUserAsync(request);

        return StatusCode(StatusCodes.Status201Created, result);
    }

}
