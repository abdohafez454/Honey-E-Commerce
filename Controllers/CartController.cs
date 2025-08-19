using Microsoft.AspNetCore.Mvc;

namespace Honey_E_commerce.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Index()
        {
            return View("Cart");
        }
    }
}
