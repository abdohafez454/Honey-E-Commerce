using System.ComponentModel.DataAnnotations;

namespace Honey_E_commerce.Models
{
    public class Order
    {
        [Key]
        public Guid OrderID { get; set; }
        
        public Guid CustomerID { get; set; }
        
        public Guid ProductID { get; set; }

        public int Quantity { get; set; }

        public double UnitPrice { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        //public string Status { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual Product Product { get; set; }

    }
}
