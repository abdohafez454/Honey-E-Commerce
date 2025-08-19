using System.ComponentModel.DataAnnotations;

namespace Honey_E_commerce.Models
{
    public class Product
    {
        public Guid ProductID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public Guid CategoryID { get; set; }

        [MaxLength(255)]
        public string ImageUrl { get; set; }

        public virtual Category Category { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
    }

}
