// frontend/assets/js/admin_common.js
// File này được dùng chung cho tất cả các trang trong /admin/ (trừ login.html)

document.addEventListener("DOMContentLoaded", async () => {
  await checkAdminAuth();
  await loadAdminUserInfo();
  attachAdminLogoutEvent();
  highlightCurrentPage();
});

// Kiểm tra quyền admin
async function checkAdminAuth() {
  try {
    const response = await apiFetch(`${API_URL}/auth.php?action=check`);
    const result = await response.json();

    console.log("Auth check response:", result); // Debug

    // Xử lý cả 2 trường hợp: result.user hoặc result.data
    const userData = result.user || result.data;

    if (result.status !== "success" || !userData || userData.role !== "admin") {
      alert("Bạn không có quyền truy cập trang này.");
      window.location.href = "login.html";
      return;
    }

    return userData;
  } catch (error) {
    console.error("Lỗi kiểm tra auth:", error);
    window.location.href = "login.html";
  }
}

// Tải thông tin user vào sidebar
async function loadAdminUserInfo() {
  const sidebarUser = document.getElementById("admin-sidebar-user");
  if (!sidebarUser) return;

  try {
    const response = await apiFetch(`${API_URL}/auth.php?action=check`);
    const result = await response.json();

    console.log("User info response:", result); // Debug - xem cấu trúc dữ liệu

    if (result.status === "success") {
      // Xử lý cả 2 trường hợp: result.user hoặc result.data
      const userData = result.user || result.data;

      const username = userData?.username || userData?.full_name || "Admin";
      const email = userData?.email || "";

      sidebarUser.innerHTML = `
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="user-details">
          <p class="user-name"><strong>${username}</strong></p>
          ${email ? `<p class="user-email">${email}</p>` : ""}
          <a href="#" id="admin-logout-link" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </a>
        </div>
      `;
    }
  } catch (error) {
    console.error("Lỗi tải thông tin user:", error);
  }
}

// Gắn sự kiện logout
function attachAdminLogoutEvent() {
  document.addEventListener("click", (e) => {
    if (
      e.target.id === "admin-logout-link" ||
      e.target.closest("#admin-logout-link")
    ) {
      handleAdminLogout(e);
    }
  });
}

// Xử lý đăng xuất - THÊM HÀM NÀY
async function handleAdminLogout(e) {
  e.preventDefault();

  if (!confirm("Bạn có chắc muốn đăng xuất?")) {
    return;
  }

  try {
    const response = await apiFetch(`${API_URL}/auth.php?action=logout`, {
      method: "POST",
    });
    const result = await response.json();

    if (result.status === "success") {
      window.location.href = "login.html";
    } else {
      alert("Đăng xuất thất bại: " + result.message);
    }
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    alert("Lỗi kết nối khi đăng xuất.");
  }
}

// Highlight trang hiện tại trong sidebar
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".admin-nav a");

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}
