using Honey_E_commerce.Data;
using Honey_E_commerce.Models;
using Honey_E_commerce.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Net.Sockets;
using System.Threading.Tasks;

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

        public async Task<IActionResult> EditProduct(Guid Id)
        {
            var product = await context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.ProductID == Id);

            var allCategories = await context.Categories.ToListAsync();

            var viewModel = new ProductAndCategoryViewModel
            {
                ProductID = product.ProductID,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                CategoryID = product.CategoryID,
                ImageUrl = product.ImageUrl,
                Categories = allCategories.Select(c => new SelectListItem
                {
                    Value = c.CategoryID.ToString(),
                    Text = c.Name,
                    Selected = c.CategoryID == product.CategoryID
                }).ToList()
            };

            return View(viewModel);
        }    

        public async Task<IActionResult> UpdateEditProduct(Product Updatedproduct,string ProductImageFile)
        {
            var oldProduct = await context.Products
                .FirstOrDefaultAsync(p => p.ProductID == Updatedproduct.ProductID);
            
            //Mapping
            oldProduct.CategoryID = Updatedproduct.CategoryID;
            oldProduct.Name = Updatedproduct.Name;
            oldProduct.Price = Updatedproduct.Price;
            oldProduct.Description = Updatedproduct.Description;
            oldProduct.StockQuantity = Updatedproduct.StockQuantity;
            oldProduct.ImageUrl = ProductImageFile != null ? ProductImageFile : Updatedproduct.ImageUrl;

            context.Update(oldProduct);
            await context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Product updated successfully!";

            return RedirectToAction("EditProduct",new {Id = oldProduct.ProductID});
        }

        public async Task<IActionResult> RemoveProductFromCategoryAsync(Guid productId)
        {
            var product = await context.Products.FirstOrDefaultAsync(p=>p.ProductID == productId);
            var categoryId = product.CategoryID;

            Guid notCatgeorizedId = Guid.Parse("9D5A95B6-0B9C-47EA-9A13-7685324CBA2E");

            product.CategoryID = notCatgeorizedId;

            context.Update(product);

            await context.SaveChangesAsync();

            return RedirectToAction("EditCategory", new { Id = categoryId });
        }

        public IActionResult Categories()
        {
            var categories = context.Categories
                        .Select(c => new
                        {
                            Category = c,
                            TotalProductsPrice = c.Products.Sum(p => p.Price),
                            TotalProducts = c.Products.Count()
                        }).ToList();
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

            var viewModel = new CategoryAndProductViewModel
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

            TempData["SuccessMessage"] = "Category updated successfully!";

            return RedirectToAction("EditCategory", new {Id = updatedCategory.CategoryID});
        }

        public async Task<IActionResult> DeleteCategory(Guid Id)
        {
            Guid notCatgeorizedId = Guid.Parse("9D5A95B6-0B9C-47EA-9A13-7685324CBA2E");

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
