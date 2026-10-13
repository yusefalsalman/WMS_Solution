using Microsoft.AspNetCore.Mvc;
using WMS.API.Interfaces;
using WMS.API.Models.DTOs;

namespace WMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WarehousesController : ControllerBase
{
    private readonly IWarehouseService _warehouseService;

    public WarehousesController(IWarehouseService warehouseService)
    {
        _warehouseService = warehouseService;
    }

    [HttpGet]
    public async Task<ActionResult<List<WarehouseResponse>>> GetAllWarehouses()
    {
        var warehouses = await _warehouseService.GetAllWarehousesAsync();
        return Ok(warehouses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WarehouseResponse>> GetWarehouseById(Guid id)
    {
        var warehouse = await _warehouseService.GetWarehouseByIdAsync(id);
        if (warehouse == null)
        {
            // 404 Not Found response 
            return NotFound();
        }
        // 200 OK response with the warehouse data
        return Ok(warehouse);
    }

    [HttpPost]
    public async Task<ActionResult<WarehouseResponse>> CreateWarehouse(CreateWarehouseRequest request)
    {
        var createdWarehouse = await _warehouseService.CreateWarehouseAsync(request);
        // 201 Created response 
        return CreatedAtAction(nameof(GetWarehouseById), new { id = createdWarehouse.Id }, createdWarehouse);
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<WarehouseResponse>> UpdateWarehouse(Guid id, UpdateWarehouseRequest request)
    {
        var updatedWarehouse = await _warehouseService.UpdateWarehouseAsync(id, request);
        if (updatedWarehouse == null)
        {
            return NotFound();
        }
        return Ok(updatedWarehouse);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWarehouse(Guid id)
    {
        var deleted = await _warehouseService.DeleteWarehouseAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        // 204 No Content response indicating successful deletion
        return NoContent();
    }
}