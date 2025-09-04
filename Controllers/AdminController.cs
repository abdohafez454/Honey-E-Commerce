using Honey_E_commerce.Data;
using Honey_E_commerce.Models;
using Honey_E_commerce.Models.ViewModels;
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
        public IActionResult EditCategory(Guid Id)
        {
            var category = context.Categories
                .Include(c => c.Products)
                .FirstOrDefault(c => c.CategoryID == Id);

            if (category == null)
            {
                return NotFound();
            }

            var viewModel = new EditCategoryViewModel
            {
                CategoryID = category.CategoryID,
                Name = category.Name,
                Description = category.Description,
                Products = category.Products?.Select(p => new Product
                {
                    ProductID = p.ProductID,
                    Name = p.Name,
                    Price = p.Price,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                }).ToList() ?? new List<Product>()
            };

            return View(viewModel);
        }

        public IActionResult UpdateEditCategory(Category updatedCategory)
        {
            context.Categories.Update(updatedCategory);
            context.SaveChanges();
            return RedirectToAction("Categories");
        }

        public async Task<IActionResult> DeleteCategory(Guid Id)
        {
            Guid notCatgeorizedId = Guid.Parse("9D5A95B6-0B9C-47EA-9A13-7685324CBA2E");
            //var notCatgeorized = await context.Categories.FindAsync(notCatgeorizedId);

            var deletedCategory = await context.Categories.FindAsync(Id);

            var deletedCategoryProducts = context.Products.Where(p => p.CategoryID == Id).ToList();

            foreach (var product in deletedCategoryProducts)
            {
                product.CategoryID = notCatgeorizedId;
                context.Update(product);
            }

            await context.SaveChangesAsync();

            context.Categories.Remove(deletedCategory);

            await context.SaveChangesAsync();

            return RedirectToAction("Categories");
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
