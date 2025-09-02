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

        public IActionResult Test(string Name)
        {
            return RedirectToAction("Products");
        }
        public IActionResult Categories()
        {
            List<Category> categories = context.Categories.ToList();
            return View(categories);
        }
        [HttpPost]
        public IActionResult Categories(Category category)
        {
            category.CategoryID = Guid.NewGuid();
            context.Categories.Add(category);
            context.SaveChanges();

            return RedirectToAction("Categories");
        }
        [HttpPost]
        public IActionResult EditCategories(Category category)
        {
            //category.CategoryID = Guid.NewGuid();
            context.Categories.Update(category);
            context.SaveChanges();

            return RedirectToAction("Categories");
        }

        [HttpGet]
        public async Task<IActionResult> GetCategory(int id)
        {

             var category = await context.Categories.FindAsync(id);

             if (category == null)
             {
                 return NotFound(new { success = false, message = "Category not found" });
             }

             return Ok(new
             {
                 id = category.CategoryID,
                 name = category.Name,
                 description = category.Description
             });
            
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
