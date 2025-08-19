// Admin Login JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("adminLoginForm")
  const emailInput = document.getElementById("adminEmail")
  const passwordInput = document.getElementById("adminPassword")
  const passwordToggle = document.getElementById("passwordToggle")
  const emailError = document.getElementById("emailError")
  const passwordError = document.getElementById("passwordError")

  // Password toggle functionality
  if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)

      const icon = passwordToggle.querySelector("i")
      if (type === "password") {
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      } else {
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      }
    })
  }

  // Email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password validation
  function validatePassword(password) {
    return password.length >= 6
  }

  // Show error message
  function showError(element, message) {
    element.textContent = message
    element.style.display = "block"
    element.parentElement.querySelector("input").style.borderColor = "#dc3545"
  }

  // Hide error message
  function hideError(element) {
    element.style.display = "none"
    element.parentElement.querySelector("input").style.borderColor = "#e0e0e0"
  }

  // Real-time validation
  emailInput.addEventListener("blur", function () {
    const email = this.value.trim()
    if (!email) {
      showError(emailError, "Email address is required")
    } else if (!validateEmail(email)) {
      showError(emailError, "Please enter a valid email address")
    } else {
      hideError(emailError)
    }
  })

  emailInput.addEventListener("input", () => {
    if (emailError.style.display === "block") {
      hideError(emailError)
    }
  })

  passwordInput.addEventListener("blur", function () {
    const password = this.value
    if (!password) {
      showError(passwordError, "Password is required")
    } else if (!validatePassword(password)) {
      showError(passwordError, "Password must be at least 6 characters long")
    } else {
      hideError(passwordError)
    }
  })

  passwordInput.addEventListener("input", () => {
    if (passwordError.style.display === "block") {
      hideError(passwordError)
    }
  })

  // Form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = emailInput.value.trim()
      const password = passwordInput.value
      let isValid = true

      // Validate email
      if (!email) {
        showError(emailError, "Email address is required")
        isValid = false
      } else if (!validateEmail(email)) {
        showError(emailError, "Please enter a valid email address")
        isValid = false
      }

      // Validate password
      if (!password) {
        showError(passwordError, "Password is required")
        isValid = false
      } else if (!validatePassword(password)) {
        showError(passwordError, "Password must be at least 6 characters long")
        isValid = false
      }

      if (isValid) {
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]')
        const originalText = submitBtn.innerHTML
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Signing In...</span>'
        submitBtn.disabled = true

        // Simulate login process (replace with actual authentication)
        setTimeout(() => {
          // For demo purposes, accept any valid email/password combination
          if (email && password.length >= 6) {
            // Redirect to admin dashboard
            window.location.href = "/Admin/Dashboard"
          } else {
            // Show error
            showError(passwordError, "Invalid email or password")
            submitBtn.innerHTML = originalText
            submitBtn.disabled = false
          }
        }, 2000)
      }
    })
  }

  // Add floating animation to background elements
  const floatingElements = document.querySelectorAll(".floating-element")
  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 2}s`
  })
})
