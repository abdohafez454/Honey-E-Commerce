using Microsoft.AspNetCore.Mvc;

namespace Honey_E_commerce.Controllers
{
    public class ReviewsController : Controller
    {
        public IActionResult Index()
        {
            return View("Reviews");
        }
    }
}
