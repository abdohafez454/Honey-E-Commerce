using Microsoft.AspNetCore.Mvc;

namespace Honey_E_commerce.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult Index()
        {
            return View("Products");
        }

        /*public IActionResult ProductDetails()
        {
            return 
        }*/
    }
}
