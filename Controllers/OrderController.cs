using Microsoft.AspNetCore.Mvc;

namespace Honey_E_commerce.Controllers
{
    public class OrderController : Controller
    {
        public IActionResult Index()
        {
            return View("Order");
        }
    }
}
