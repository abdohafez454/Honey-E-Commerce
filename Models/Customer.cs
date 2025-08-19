using System.ComponentModel.DataAnnotations;

namespace Honey_E_commerce.Models
{
    public class Customer
    {
        [Key]
        public Guid ID { get; set; }

        [Required]
        [MaxLength(100)]
        public Guid CustomerName { get; set; }

        [Required]
        [Phone]
        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        [Required]
        [MaxLength(255)]
        public string Address { get; set; }

        public virtual ICollection<Order> Orders { get; set; }

    }
}
