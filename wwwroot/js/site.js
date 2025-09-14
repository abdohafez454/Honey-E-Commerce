// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Navbar background on scroll
  let lastScrollTop = 0
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (navbar) {
      if (scrollTop > 100) {
        navbar.style.background = "rgba(255, 248, 220, 0.95)"
        navbar.style.backdropFilter = "blur(30px)"
        navbar.style.boxShadow = "0 12px 40px rgba(212, 175, 55, 0.2)"
      } else {
        navbar.style.background = "rgba(255, 248, 220, 0.85)"
        navbar.style.backdropFilter = "blur(25px)"
        navbar.style.boxShadow = "0 8px 32px rgba(212, 175, 55, 0.15)"
      }

      // Hide/show navbar on scroll
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        navbar.style.transform = "translateY(-100%)"
      } else {
        navbar.style.transform = "translateY(0)"
      }
      lastScrollTop = scrollTop
    }
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right").forEach((el) => {
    observer.observe(el)
  })

  // Product filter functionality
  const filterButtons = document.querySelectorAll(".filter-btn")
  const productCards = document.querySelectorAll(".product-card")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked button
      this.classList.add("active")

      const filterValue = this.getAttribute("data-filter")

      productCards.forEach((card) => {
        if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
          card.style.display = "block"
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "scale(1)"
          }, 100)
        } else {
          card.style.opacity = "0"
          card.style.transform = "scale(0.8)"
          setTimeout(() => {
            card.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // Quantity controls for order page
  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const isIncrement = this.classList.contains("plus")
      const input = isIncrement ? this.previousElementSibling : this.nextElementSibling

      let currentValue = Number.parseInt(input.value) || 0

      if (isIncrement) {
        currentValue++
      } else {
        currentValue = Math.max(0, currentValue - 1)
      }

      input.value = currentValue
      updateOrderSummary()
    })
  })

  // Update quantity inputs
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", function () {
      const value = Math.max(0, Number.parseInt(this.value) || 0)
      this.value = value
      updateOrderSummary()
    })
  })

  // Order summary calculation
  function updateOrderSummary() {
    let subtotal = 0
    const shipping = 5.99
    const discount = 0

    document.querySelectorAll(".product-item").forEach((item) => {
      const qtyInput = item.querySelector(".qty-input")
      const priceInput = item.querySelector('input[name*="Price"]')

      if (qtyInput && priceInput) {
        const quantity = Number.parseInt(qtyInput.value) || 0
        const price = Number.parseFloat(priceInput.value) || 0
        subtotal += quantity * price
      }
    })

    // Free shipping on orders over $50
    const finalShipping = subtotal >= 50 ? 0 : shipping
    const total = subtotal + finalShipping - discount

    // Update display
    const subtotalEl = document.querySelector(".subtotal")
    const shippingEl = document.querySelector(".shipping")
    const discountEl = document.querySelector(".discount-amount")
    const totalEl = document.querySelector(".total-amount")

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`
    if (shippingEl) shippingEl.textContent = finalShipping === 0 ? "FREE" : `$${finalShipping.toFixed(2)}`
    if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`
  }

  // Promo code functionality
  const promoInput = document.querySelector(".promo-input")
  const applyPromoBtn = document.querySelector(".apply-promo-btn")

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener("click", () => {
      const promoCode = promoInput.value.trim().toLowerCase()
      let discountAmount = 0

      // Sample promo codes
      const promoCodes = {
        honey10: 0.1,
        welcome15: 0.15,
        save20: 0.2,
      }

      if (promoCodes[promoCode]) {
        const subtotal = Number.parseFloat(document.querySelector(".subtotal").textContent.replace("$", ""))
        discountAmount = subtotal * promoCodes[promoCode]

        // Update discount display
        document.querySelector(".discount-amount").textContent = `-$${discountAmount.toFixed(2)}`

        // Show success message
        window.HoneyStore.showNotification("Promo code applied successfully!", "success")
        promoInput.value = ""
        applyPromoBtn.textContent = "Applied"
        applyPromoBtn.disabled = true

        updateOrderSummary()
      } else {
        window.HoneyStore.showNotification("Invalid promo code", "error")
      }
    })
  }

  // Rating input functionality
  document.querySelectorAll(".rating-input input").forEach((input) => {
    input.addEventListener("change", function () {
      const rating = this.value
      console.log("Rating selected:", rating)
    })
  })

  // Form validation
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const requiredFields = form.querySelectorAll("[required]")
      let isValid = true

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.style.borderColor = "#ff4444"
          field.addEventListener(
            "input",
            function () {
              this.style.borderColor = "#e0e0e0"
            },
            { once: true },
          )
        }
      })

      if (!isValid) {
        e.preventDefault()
        window.HoneyStore.showNotification("Please fill in all required fields", "error")
      }
    })
  })

  // Notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `

    // Add notification styles if not already present
    if (!document.querySelector("#notification-styles")) {
      const styles = document.createElement("style")
      styles.id = "notification-styles"
      styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 10px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    min-width: 300px;
                    animation: slideInRight 0.3s ease;
                }
                .notification-success { background: #4CAF50; }
                .notification-error { background: #f44336; }
                .notification-info { background: var(--primary-gold); }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `
      document.head.appendChild(styles)
    }

    document.body.appendChild(notification)

    // Close button functionality
    notification.querySelector(".notification-close").addEventListener("click", () => {
      notification.remove()
    })

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }

  // Initialize order summary on page load
  if (document.querySelector(".order-page")) {
    updateOrderSummary()
  }

  // Add loading states to buttons
  document.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.addEventListener("click", function () {
      const originalText = this.innerHTML
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
      this.disabled = true

      // Re-enable after 3 seconds (for demo purposes)
      setTimeout(() => {
        this.innerHTML = originalText
        this.disabled = false
      }, 3000)
    })
  })

  // Lazy loading for images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  }

  // Add hover effects to product cards
  document.querySelectorAll(".product-card, .testimonial-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)"
      this.style.boxShadow = "0 25px 60px rgba(0, 0, 0, 0.15)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
      this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)"
    })
  })

  // Initialize tooltips (if needed)
  document.querySelectorAll("[data-tooltip]").forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const tooltip = document.createElement("div")
      tooltip.className = "tooltip"
      tooltip.textContent = this.getAttribute("data-tooltip")
      document.body.appendChild(tooltip)

      const rect = this.getBoundingClientRect()
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"
    })

    element.addEventListener("mouseleave", () => {
      const tooltip = document.querySelector(".tooltip")
      if (tooltip) {
        tooltip.remove()
      }
    })
  })

  // Enhanced image loading with fallbacks
  document.querySelectorAll(".product-image img").forEach((img) => {
    const container = img.closest(".product-image")

    // Add loading state
    container.classList.add("image-loading")

    img.addEventListener("load", function () {
      container.classList.remove("image-loading")
      this.style.opacity = "1"
    })

    img.addEventListener("error", function () {
      container.classList.remove("image-loading")
      this.src = "/placeholder.svg?height=250&width=200&text=Honey+Product"
      this.alt = "Honey Product"
    })
  })

  // Cart functionality
  let cart = JSON.parse(localStorage.getItem("honeyCart")) || []

  // Add to cart function
  function addToCart(productName, price) {
    const existingItem = cart.find((item) => item.name === productName)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: Date.now(),
        name: productName,
        price: price,
        quantity: 1,
        image: `/placeholder.svg?height=80&width=80&text=${encodeURIComponent(productName)}`,
      })
    }

    updateCartStorage()
    updateCartCount()
    window.HoneyStore.showNotification(`${productName} added to cart!`, "success")
  }

  // Update cart storage
  function updateCartStorage() {
    localStorage.setItem("honeyCart", JSON.stringify(cart))
  }

  // Update cart count in navbar
  function updateCartCount() {
    const cartCount = document.querySelector(".cart-count")
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    if (cartCount) {
      cartCount.textContent = totalItems
      cartCount.style.display = totalItems > 0 ? "flex" : "none"
    }
  }

  // Clear cart
  function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
      cart = []
      updateCartStorage()
      updateCartCount()
      renderCartItems()
      updateCartSummary()
      window.HoneyStore.showNotification("Cart cleared successfully!", "info")
    }
  }

    //New Functions




  // Remove item from cart
  

  // Update item quantity
  

  // Render cart items
  function renderCartItems() {
    const container = document.getElementById("cartItemsContainer")
    const emptyCart = document.getElementById("emptyCart")
    const cartActions = document.getElementById("cartActions")

    if (!container) return

    if (cart.length === 0) {
      emptyCart.style.display = "block"
      cartActions.style.display = "none"
      container.innerHTML = ""
      container.appendChild(emptyCart)
      return
    }

    emptyCart.style.display = "none"
    cartActions.style.display = "flex"

    const cartItemsHTML = cart
      .map(
        (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-controls">
          <button class="qty-control-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-control-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `,
      )
      .join("")

    container.innerHTML = cartItemsHTML
  }

  // Update cart summary
  
    
  // Apply promo code
  function applyPromoCode() {
    const promoInput = document.getElementById("promoCode")
    const promoCode = promoInput.value.trim().toLowerCase()

    const promoCodes = {
      honey10: 0.1,
      welcome15: 0.15,
      save20: 0.2,
    }

    if (promoCodes[promoCode]) {
      window.HoneyStore.showNotification(`Promo code applied! ${promoCodes[promoCode] * 100}% discount`, "success")
      promoInput.value = ""
      // Here you would apply the discount logic
    } else {
      window.HoneyStore.showNotification("Invalid promo code", "error")
    }
  }

  // Proceed to checkout
  function proceedToCheckout() {
    if (cart.length === 0) {
      window.HoneyStore.showNotification("Your cart is empty!", "error")
      return
    }

    // Redirect to order page or checkout process
    window.location.href = "/Order"
  }

  // Update cart function for existing update button
  

  // Initialize cart
  updateCartCount()

  // If on cart page, render items
  if (document.querySelector(".cart-page")) {
    renderCartItems()
    updateCartSummary()
  }

  // Smooth scroll for hero scroll indicator
  document.querySelector(".hero-scroll-indicator")?.addEventListener("click", () => {
    document.querySelector("#featured-products")?.scrollIntoView({
      behavior: "smooth",
    })
  })
})

// Increase quantity
function increaseQty(button) {
    const qtyDisplay = button.parentElement.querySelector(".qty-display");
    let qty = parseInt(qtyDisplay.textContent);
    qtyDisplay.textContent = qty + 1;

    updateCartTotals();
}

// Decrease quantity
function decreaseQty(button) {
    const qtyDisplay = button.parentElement.querySelector(".qty-display");
    let qty = parseInt(qtyDisplay.textContent);
    if (qty > 1) {
        qtyDisplay.textContent = qty - 1;
    }
    updateCartTotals();
}

// Remove item from cart
function removeFromCart(button) {
    const cartItem = button.closest(".cart-item");
    cartItem.remove();
    updateCartTotals();
}

// Update subtotal & total
function updateCartTotals() {
    let subtotal = 0;
    document.querySelectorAll(".cart-item").forEach(item => {
        const price = parseFloat(item.querySelector(".cart-item-price").textContent.replace("$", ""));
        const qty = parseInt(item.querySelector(".qty-display").textContent);
        subtotal += price * qty;
    });

    const shipping = 5.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    document.querySelector(".cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector(".cart-tax").textContent = `$${tax.toFixed(2)}`;
    document.querySelector(".cart-total").textContent = `$${total.toFixed(2)}`;
}
function clearCart() {
    const container = document.getElementById("cartItemsContainer");

    if (!container) return;

    if (confirm("Are you sure you want to clear your cart?")) {
        // Remove all cart item elements
        container.innerHTML = "";

        // Reset totals
        updateCartTotals();

        // Show empty cart message if you have one
        const emptyCart = document.getElementById("emptyCart");
        if (emptyCart) {
            emptyCart.style.display = "block";
        }

        // Hide cart actions if you have them
        const cartActions = document.getElementById("cartActions");
        if (cartActions) {
            cartActions.style.display = "none";
        }

        // Show notification
        window.HoneyStore.showNotification("Cart cleared successfully!", "info");
    }
}


// Additional utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePhone(phone) {
  const re = /^[+]?[1-9][\d]{0,15}$/
  return re.test(phone.replace(/\s/g, ""))
}

// Export functions for use in other scripts
window.HoneyStore = {
  showNotification: (message, type = "info") => {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `

    // Add notification styles if not already present
    if (!document.querySelector("#notification-styles")) {
      const styles = document.createElement("style")
      styles.id = "notification-styles"
      styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 10px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    min-width: 300px;
                    animation: slideInRight 0.3s ease;
                }
                .notification-success { background: #4CAF50; }
                .notification-error { background: #f44336; }
                .notification-info { background: var(--primary-gold); }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `
      document.head.appendChild(styles)
    }

    document.body.appendChild(notification)

    // Close button functionality
    notification.querySelector(".notification-close").addEventListener("click", () => {
      notification.remove()
    })

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  },
  formatCurrency: formatCurrency,
  validateEmail: validateEmail,
  validatePhone: validatePhone,
  addToCart: addToCart,
  clearCart: clearCart,
  removeFromCart: removeFromCart,
  updateQuantity: updateQuantity,
  updateCart: updateCart,
  applyPromoCode: applyPromoCode,
  proceedToCheckout: proceedToCheckout,
}
