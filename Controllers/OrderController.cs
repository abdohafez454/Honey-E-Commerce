using Honey_E_commerce.Data;
using Honey_E_commerce.Models;
using Microsoft.AspNetCore.Mvc;

namespace Honey_E_commerce.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext context;
        public OrderController(ApplicationDbContext _context)
        {
            context = _context;

        }
        public IActionResult Index()
        {
            decimal subtotal = 0m;
            var products = GetCartFromSession();
            Dictionary<Product, int> prdDic = new Dictionary<Product, int>();
            foreach (var item in products)
            {
                var prd = context.Products.Find(item.Key);
                prdDic.Add(prd, item.Value);
                subtotal += prd.Price * item.Value;
            }

            ViewBag.total = subtotal;

            return View("Order", prdDic);
        }
        private Dictionary<Guid, int> GetCartFromSession()
        {
            var cartData = HttpContext.Session.GetString("CartItems");
            if (string.IsNullOrEmpty(cartData))
            {
                return new Dictionary<Guid, int>();
            }
            // Format: "guid1:quantity1,guid2:quantity2"
            var cartItems = new Dictionary<Guid, int>();
            var items = cartData.Split(',');
            foreach (var item in items)
            {
                var parts = item.Split(':');
                if (parts.Length == 2 &&
                    Guid.TryParse(parts[0], out Guid productId) &&
                    int.TryParse(parts[1], out int quantity))
                {
                    cartItems[productId] = quantity;
                }
            }
            return cartItems;
        }
    }
}
