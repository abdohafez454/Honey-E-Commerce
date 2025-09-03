using System.ComponentModel.DataAnnotations;

namespace Honey_E_commerce.Models.ViewModels
{
    public class EditCategoryViewModel
    {
        public Guid CategoryID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        public List<Product> Products { get; set; } = new List<Product>(); 
    }
}
