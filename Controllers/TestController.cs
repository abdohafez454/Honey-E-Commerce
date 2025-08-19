using Honey_E_commerce.Data;
using Honey_E_commerce.Models;
using Microsoft.AspNetCore.Mvc;

namespace Honey_E_commerce.Controllers
{
    public class TestController : Controller
    {
        ApplicationDbContext context;
        public TestController(ApplicationDbContext _context)
        {
            context = _context;
        }
        public IActionResult Index()
        {
            Category c1 = new Category();
            c1.CategoryID = Guid.NewGuid();
            c1.Name = "Bee Products";
            c1.Description = "Other bee-based products like propolis";
            context.Categories.Add(c1);
            context.SaveChanges();


            return View();
        }
    }
}
