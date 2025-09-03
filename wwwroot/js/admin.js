// Admin Dashboard JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById("sidebarToggle")
    const mobileMenuToggle = document.getElementById("mobileMenuToggle")
    const sidebar = document.getElementById("adminSidebar")
    const mainContent = document.querySelector(".admin-main")
    const mobileOverlay = document.getElementById("mobileOverlay")

    function toggleSidebar() {
        if (window.innerWidth <= 1024) {
            // Mobile behavior
            sidebar.classList.toggle("show")
            mobileOverlay.classList.toggle("show")
        } else {
            // Desktop behavior
            sidebar.classList.toggle("collapsed")
            mainContent.classList.toggle("expanded")
        }
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", toggleSidebar)
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", toggleSidebar)
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener("click", () => {
            sidebar.classList.remove("show")
            mobileOverlay.classList.remove("show")
        })
    }

    // Notification dropdown
    const notificationBtn = document.getElementById("notificationBtn")
    const notificationDropdown = document.getElementById("notificationDropdown")

    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            notificationDropdown.classList.toggle("show")
        })
    }

    // Profile dropdown
    const profileBtn = document.getElementById("profileBtn")
    const profileDropdown = document.getElementById("profileDropdown")

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            profileDropdown.classList.toggle("show")
        })
    }

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
        if (notificationDropdown) {
            notificationDropdown.classList.remove("show")
        }
        if (profileDropdown) {
            profileDropdown.classList.remove("show")
        }
    })

    // Dashboard refresh functionality
    window.refreshDashboard = () => {
        const refreshBtn = document.querySelector(".refresh-btn")
        if (refreshBtn) {
            const originalText = refreshBtn.innerHTML
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...'
            refreshBtn.disabled = true

            setTimeout(() => {
                refreshBtn.innerHTML = originalText
                refreshBtn.disabled = false
                showNotification("Dashboard refreshed successfully!", "success")
            }, 2000)
        }
    }

    // Product management functions
    window.openAddProductModal = () => {
        const modal = document.getElementById("productModal")
        const modalTitle = document.getElementById("modalTitle")
        const form = document.getElementById("productForm")

        if (modal && modalTitle && form) {
            modalTitle.textContent = "Add New Product"
            form.reset()
            modal.classList.add("show")
        }
    }

    window.closeProductModal = () => {
        const modal = document.getElementById("productModal")
        if (modal) {
            modal.classList.remove("show")
        }
    }

    window.editProduct = (productId) => {
        const modal = document.getElementById("productModal")
        const modalTitle = document.getElementById("modalTitle")

        if (modal && modalTitle) {
            modalTitle.textContent = "Edit Product"
            // Here you would populate the form with existing product data
            modal.classList.add("show")
        }
    }

    window.viewProduct = (productId) => {
        showNotification(`Viewing product ${productId}`, "info")
    }

    window.deleteProduct = (productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            showNotification(`Product ${productId} deleted successfully!`, "success")
        }
    }

    window.saveProduct = (event) => {
        event.preventDefault();
        const form = document.getElementById("productForm")
        const formData = new FormData(form)

        fetch('/Admin/Products', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    showNotification("Product saved successfully!", "success")
                    window.closeProductModal()
                } else {
                    showNotification("Failed to save product", "error")
                }
            })
            .catch(error => {
                console.error("Error:", error)
                showNotification("Error saving product", "error")
            })
    }


    // Review management functions
    window.approveReview = (reviewId) => {
        showNotification(`Review ${reviewId} approved successfully!`, "success")
        // Update UI to reflect approval
        const reviewCard = document.querySelector(`[data-review-id="${reviewId}"]`)
        if (reviewCard) {
            reviewCard.classList.remove("pending")
            reviewCard.classList.add("approved")
        }
    }

    window.rejectReview = (reviewId) => {
        if (confirm("Are you sure you want to reject this review?")) {
            showNotification(`Review ${reviewId} rejected`, "info")
            // Update UI to reflect rejection
            const reviewCard = document.querySelector(`[data-review-id="${reviewId}"]`)
            if (reviewCard) {
                reviewCard.classList.remove("pending")
                reviewCard.classList.add("rejected")
            }
        }
    }

    window.deleteReview = (reviewId) => {
        if (confirm("Are you sure you want to delete this review permanently?")) {
            showNotification(`Review ${reviewId} deleted permanently`, "info")
        }
    }

    window.replyToReview = (reviewId) => {
        const modal = document.getElementById("replyModal")
        const originalReviewText = document.getElementById("originalReviewText")

        if (modal && originalReviewText) {
            // Set the original review text (this would come from your data)
            originalReviewText.textContent = "This is the original review text..."
            modal.classList.add("show")
        }
    }

    window.closeReplyModal = () => {
        const modal = document.getElementById("replyModal")
        if (modal) {
            modal.classList.remove("show")
        }
    }

    window.submitReply = () => {
        const replyText = document.getElementById("replyText")
        if (replyText && replyText.value.trim()) {
            showNotification("Reply sent successfully!", "success")
            window.closeReplyModal() // Declared window.closeReplyModal
        } else {
            showNotification("Please enter a reply message", "error")
        }
    }

    // Order management functions
    window.updateOrderStatus = (orderId, newStatus) => {
        showNotification(`Order ${orderId} status updated to ${newStatus}`, "success")
    }

    window.viewOrderDetails = (orderId) => {
        const modal = document.getElementById("orderDetailsModal")
        const modalOrderId = document.getElementById("modalOrderId")

        if (modal && modalOrderId) {
            modalOrderId.textContent = `#ORD-${orderId.toString().padStart(3, "0")}`
            modal.classList.add("show")
        }
    }

    window.closeOrderDetailsModal = () => {
        const modal = document.getElementById("orderDetailsModal")
        if (modal) {
            modal.classList.remove("show")
        }
    }

    window.editOrder = (orderId) => {
        showNotification(`Editing order ${orderId}`, "info")
    }

    window.printInvoice = (orderId) => {
        showNotification(`Printing invoice for order ${orderId}`, "info")
        // Here you would implement actual printing functionality
    }

    // Bulk actions for orders
    const selectAllCheckbox = document.getElementById("selectAll")
    const orderCheckboxes = document.querySelectorAll(".order-checkbox")
    const bulkActions = document.getElementById("bulkActions")
    const selectedCount = document.getElementById("selectedCount")

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function () {
            orderCheckboxes.forEach((checkbox) => {
                checkbox.checked = this.checked
            })
            updateBulkActions()
        })
    }

    orderCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", updateBulkActions)
    })

    function updateBulkActions() {
        const checkedBoxes = document.querySelectorAll(".order-checkbox:checked")
        const count = checkedBoxes.length

        if (selectedCount) {
            selectedCount.textContent = count
        }

        if (bulkActions) {
            bulkActions.style.display = count > 0 ? "flex" : "none"
        }
    }

    window.bulkUpdateStatus = () => {
        const checkedBoxes = document.querySelectorAll(".order-checkbox:checked")
        showNotification(`Updating status for ${checkedBoxes.length} orders`, "info")
    }

    window.bulkPrintInvoices = () => {
        const checkedBoxes = document.querySelectorAll(".order-checkbox:checked")
        showNotification(`Printing invoices for ${checkedBoxes.length} orders`, "info")
    }

    window.bulkExport = () => {
        const checkedBoxes = document.querySelectorAll(".order-checkbox:checked")
        showNotification(`Exporting ${checkedBoxes.length} orders`, "info")
    }

    // Filter functionality
    const filterTabs = document.querySelectorAll(".filter-tab")
    filterTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            // Remove active class from all tabs
            filterTabs.forEach((t) => t.classList.remove("active"))
            // Add active class to clicked tab
            this.classList.add("active")

            const filter = this.getAttribute("data-filter")
            showNotification(`Filtering by: ${filter}`, "info")
        })
    })

    // Search functionality
    const searchInputs = document.querySelectorAll(".search-input")
    searchInputs.forEach((input) => {
        input.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase()
            // Implement search logic here
            console.log("Searching for:", searchTerm)
        })
    })

    // Notification system
    function showNotification(message, type = "info") {
        // Create notification element
        const notification = document.createElement("div")
        notification.className = `admin-notification admin-notification-${type}`
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `

        // Add notification styles if not already present
        if (!document.querySelector("#admin-notification-styles")) {
            const styles = document.createElement("style")
            styles.id = "admin-notification-styles"
            styles.textContent = `
                .admin-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    min-width: 300px;
                    padding: 1rem;
                    border-radius: 10px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    animation: slideInRight 0.3s ease;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }
                .admin-notification-success { background: #28a745; }
                .admin-notification-error { background: #dc3545; }
                .admin-notification-info { background: var(--primary-gold); }
                .admin-notification-warning { background: #ffc107; color: var(--dark-brown); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1rem;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }
                .notification-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `
            document.head.appendChild(styles)
        }

        // Add to page
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

    function getNotificationIcon(type) {
        switch (type) {
            case "success":
                return "check-circle"
            case "error":
                return "exclamation-circle"
            case "warning":
                return "exclamation-triangle"
            default:
                return "info-circle"
        }
    }

    // Make showNotification globally available
    window.showNotification = showNotification

    // Handle window resize
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove("show")
            mobileOverlay.classList.remove("show")
        }
    })

    // Initialize tooltips
    const tooltipElements = document.querySelectorAll("[title]")
    tooltipElements.forEach((element) => {
        element.addEventListener("mouseenter", function () {
            const tooltip = document.createElement("div")
            tooltip.className = "admin-tooltip"
            tooltip.textContent = this.getAttribute("title")
            document.body.appendChild(tooltip)

            const rect = this.getBoundingClientRect()
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"
        })

        element.addEventListener("mouseleave", () => {
            const tooltip = document.querySelector(".admin-tooltip")
            if (tooltip) {
                tooltip.remove()
            }
        })
    })

    // Add tooltip styles
    if (!document.querySelector("#admin-tooltip-styles")) {
        const styles = document.createElement("style")
        styles.id = "admin-tooltip-styles"
        styles.textContent = `
            .admin-tooltip {
                position: absolute;
                background: var(--dark-brown);
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.75rem;
                z-index: 10001;
                pointer-events: none;
                white-space: nowrap;
            }
            .admin-tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 5px solid transparent;
                border-top-color: var(--dark-brown);
            }
        `
        document.head.appendChild(styles)
    }
})
// Modal Management Functions
function openAddCategoryModal() {
    console.log("Opening add category modal...")
    const modal = document.getElementById("addCategoryModal")
    if (modal) {
        modal.style.display = "flex"
        setTimeout(() => {
            modal.classList.add("show")
        }, 10)

        // Reset form
        const form = document.getElementById("addCategoryForm")
        if (form) {
            form.reset()
            clearFormErrors("addCategoryForm")
        }

        // Reset character counts
        updateCharCount("categoryName", "nameCharCount")
        updateCharCount("categoryDescription", "descCharCount")

        // Set default values
        document.getElementById("categoryActive").checked = true
    } else {
        console.error("Add category modal not found")
    }
}

function closeAddCategoryModal() {
    const modal = document.getElementById("addCategoryModal")
    if (modal) {
        modal.classList.remove("show")
        setTimeout(() => {
            modal.style.display = "none"
        }, 300)
    }
}
function handleAddCategory(event) {
    event.preventDefault();
    const form = document.getElementById("addCategoryForm");
    const formData = new FormData(form);

    fetch('/Admin/Categories', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                showNotification("Category saved successfully!", "success");
                closeAddCategoryModal();
            } else {
                showNotification("Failed to save category", "error");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showNotification("Error saving category", "error");
        });
}


