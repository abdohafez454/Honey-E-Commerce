using System.ComponentModel.DataAnnotations;

namespace Honey_E_commerce.Models
{
    public class Review
    {
        public Guid ReviewID { get; set; }

        public Guid ProductID { get; set; }

        [Required]
        [Phone]
        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public string Comment { get; set; }

        public DateTime ReviewDate { get; set; }

        public virtual Product Product { get; set; }
    }
}
