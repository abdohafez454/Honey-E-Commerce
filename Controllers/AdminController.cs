using Honey_E_commerce.Data;
using Honey_E_commerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Honey_E_commerce.Controllers
{
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext context;
        public AdminController(ApplicationDbContext _context)
        {
            context = _context;
        }
        public IActionResult Index()
        {
            return View("Login");
        }


        [HttpPost]
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Orders()
        {
            return View("Orders");
        }

        public IActionResult Products()
        {
            ViewData["Categories"] = context.Categories
                .Select(c => new SelectListItem
                {
                    Value = c.CategoryID.ToString(),
                    Text = c.Name
                }).ToList();

            ViewData["Products"] = context.Products
                .Include(p=> p.Category)
                .Include(p=> p.Reviews)
                .ToList();


            return View("Products");
        }

        [HttpPost]
        public IActionResult Products(Product newProduct, IFormFile ImageUrl)
        {
            newProduct.ProductID = Guid.NewGuid();
            newProduct.ImageUrl = Path.GetFileName(ImageUrl.FileName);
            context.Products.Add(newProduct);
            context.SaveChanges();
            return RedirectToAction("Products"); 
        }

        public IActionResult Categories()
        {

            return View("Categories");
        }

        public IActionResult Test(string Name)
        {
            return RedirectToAction("Products");
        }

        public IActionResult Reviews()
        {
            return View("Reviews");
        }

        public IActionResult Dashboard()
        {
            return View("Dashboard");
        }
    }
}
