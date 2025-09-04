using Honey_E_commerce.Data;
using Honey_E_commerce.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Honey_E_commerce.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext context;
        public ProductController(ApplicationDbContext _context)
        {
            context = _context;
        }
        public async Task<IActionResult> Index()
        {
            var category = context.Categories
                .Include(c => c.Products)
                .ToList();

            


            return View("Products",category);
        }

        public IActionResult ProductDetails()
        {
            return View(); 
        }
    }
}
