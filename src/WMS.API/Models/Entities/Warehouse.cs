namespace WMS.API.Models.Entities;

public class Warehouse : BaseEntity
{
    public required string Code { get; set; }
    public required string Name { get; set; }
    public required string Location { get; set; }
    public bool IsActive { get; set; } = true;
}