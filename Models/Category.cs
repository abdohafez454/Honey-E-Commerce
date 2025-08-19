using System.ComponentModel.DataAnnotations;

namespace Honey_E_commerce.Models
{
    public class Category
    {
        public Guid CategoryID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }

}
