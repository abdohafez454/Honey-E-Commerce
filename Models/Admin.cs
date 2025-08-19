using System.ComponentModel.DataAnnotations;

namespace Honey_E_commerce.Models
{
    public class Admin
    {
        public int AdminID { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }
    }

}
