using Honey_E_commerce.Data;
using Honey_E_commerce.Models;
using Microsoft.AspNetCore.Mvc;

namespace Honey_E_commerce.Controllers
{
    public class CartController : Controller
    {
        private readonly ApplicationDbContext context;
        public CartController(ApplicationDbContext _context)
        {
            context = _context;

        }
        public IActionResult Index()
        {
            var products = GetCartFromSession();
            Dictionary<Product, int> prdDic = new Dictionary<Product, int>();
            foreach (var item in products)
            {
                var prd = context.Products.Find(item.Key);
                prdDic.Add(prd, item.Value);
            }

            return View("Cart", prdDic);
        }
        public IActionResult AddToCart(Guid productId, int quantity = 1)
        {
            // Find the product to verify it exists
            var product = context.Products.Find(productId);
            if (product == null)
            {
                return NotFound("Product not found");
            }

            // Get existing cart items from session
            Dictionary<Guid, int> cartItems = GetCartFromSession();

            // Add or update quantity
            if (cartItems.ContainsKey(productId))
            {
                cartItems[productId] += quantity;
            }
            else
            {
                cartItems[productId] = quantity;
            }

            SaveCartToSession(cartItems);
            return RedirectToAction("Index");
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
        private void SaveCartToSession(Dictionary<Guid, int> cartItems)
        {
            // Convert to format: "guid1:quantity1,guid2:quantity2"
            var cartData = string.Join(",", cartItems.Select(kv => $"{kv.Key}:{kv.Value}"));
            HttpContext.Session.SetString("CartItems", cartData);
        }
    }
}
