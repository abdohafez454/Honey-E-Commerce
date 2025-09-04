using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace Honey_E_commerce.Models.ViewModels
{
    public class ProductAndCategoryViewModel
    {
        public Guid ProductID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string ImageUrl { get; set; }

        [Display(Name = "Category")]
        public Guid? CategoryID { get; set; } 

        public List<SelectListItem> Categories { get; set; } = new List<SelectListItem>();



    }
}
