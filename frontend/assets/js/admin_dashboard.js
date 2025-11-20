const API_URL = "http://nhom50.itimit.id.vn/nhathuocgb/api";

function vnd(n) {
  const x = typeof n === "number" ? n : parseFloat(n) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(x);
}

function statusBadge(statusRaw) {
  const status = (statusRaw || "").toLowerCase();
  const map = {
    pending: { t: "Chờ xác nhận", bg: "#fff3cd", c: "#856404" },
    confirmed: { t: "Đã xác nhận", bg: "#d1ecf1", c: "#0c5460" },
    shipping: { t: "Đang giao", bg: "#cce5ff", c: "#004085" },
    completed: { t: "Hoàn thành", bg: "#d4edda", c: "#155724" },
    cancelled: { t: "Đã hủy", bg: "#f8d7da", c: "#721c24" },
  }[status] || { t: statusRaw || "N/A", bg: "#e2e3e5", c: "#383d41" };

  return `<span style="background:${map.bg};color:${map.c};padding:5px 12px;border-radius:20px;font-size:.85rem;font-weight:600">${map.t}</span>`;
}

function setStat(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.opacity = "0";
  setTimeout(() => {
    el.textContent = value;
    el.style.opacity = "1";
  }, 100);
}

async function loadDashboardStats() {
  try {
    const res = await fetch(`${API_URL}/dashboard.php`, {
      method: "GET",
      credentials: "include",
    });
    const result = await res.json();

    if (result.status !== "success") {
      throw new Error(result.message);
    }

    const s = result.data;
    setStat("stat-total-users", s.total_users ?? 0);
    setStat("stat-total-products", s.total_products ?? 0);
    setStat("stat-total-orders", s.total_orders ?? 0);
    setStat("stat-total-revenue", vnd(s.total_revenue ?? 0));

    renderRecentOrders(s.recent_orders || []);
  } catch (err) {
    console.error("❌ loadDashboardStats:", err);
    showStatsError("Lỗi API / Phiên đăng nhập hết hạn");
  }
}

function renderRecentOrders(orders) {
  const tb = document.getElementById("recent-orders-tbody");
  if (!tb) return;
  if (!orders.length) {
    tb.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Chưa có đơn hàng nào.</td></tr>`;
    return;
  }
  tb.innerHTML = orders
    .map(
      (o) => `
      <tr>
        <td>#${o.id}</td>
        <td>${o.customer_name || "N/A"}</td>
        <td>${vnd(o.total_price || 0)}</td>
        <td>${statusBadge(o.status)}</td>
        <td>${new Date(o.order_date).toLocaleDateString("vi-VN")}</td>
        <td>
          <a href="order_detail_admin.html?id=${
            o.id
          }" class="btn btn-sm btn-primary">
            <i class="fa-solid fa-eye"></i>
          </a>
        </td>
      </tr>`
    )
    .join("");
}

function showStatsError(msg) {
  [
    "stat-total-users",
    "stat-total-products",
    "stat-total-orders",
    "stat-total-revenue",
  ].forEach((id) => setStat(id, msg));
  const tb = document.getElementById("recent-orders-tbody");
  if (tb)
    tb.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${msg}</td></tr>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Bỏ qua check auth, chỉ load dữ liệu
  await loadDashboardData();
});

// Tải dữ liệu dashboard
async function loadDashboardData() {
  try {
    const response = await apiFetch(`${API_URL}/dashboard.php`);
    const result = await response.json();

    if (result.status === "success") {
      displayDashboardStats(result.data);
      displayRevenueChart(result.data.revenueByMonth);
      displayTopProducts(result.data.topProducts);
      displayOrdersStatus(result.data.ordersByStatus);
    } else {
      console.error("Lỗi tải dashboard:", result.message);
      showError("Không thể tải dữ liệu dashboard");
    }
  } catch (error) {
    console.error("Lỗi kết nối:", error);
    showError("Lỗi kết nối đến server");
  }
}

// Hiển thị lỗi
function showError(message) {
  const statsContainer = document.getElementById("dashboard-stats");
  if (statsContainer) {
    statsContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
}

// Hiển thị thống kê tổng quan
function displayDashboardStats(data) {
  const statsContainer = document.getElementById("dashboard-stats");
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="stat-card stat-products">
      <div class="stat-icon">
        <i class="fas fa-pills"></i>
      </div>
      <div class="stat-info">
        <h3>${data.totalProducts || 0}</h3>
        <p>Sản phẩm</p>
      </div>
    </div>

    <div class="stat-card stat-orders">
      <div class="stat-icon">
        <i class="fas fa-shopping-cart"></i>
      </div>
      <div class="stat-info">
        <h3>${data.totalOrders || 0}</h3>
        <p>Đơn hàng</p>
      </div>
    </div>

    <div class="stat-card stat-users">
      <div class="stat-icon">
        <i class="fas fa-users"></i>
      </div>
      <div class="stat-info">
        <h3>${data.totalUsers || 0}</h3>
        <p>Khách hàng</p>
      </div>
    </div>

    <div class="stat-card stat-revenue">
      <div class="stat-icon">
        <i class="fas fa-dollar-sign"></i>
      </div>
      <div class="stat-info">
        <h3>${formatCurrency(data.totalRevenue || 0)}</h3>
        <p>Doanh thu</p>
      </div>
    </div>
  `;
}

// Hiển thị biểu đồ doanh thu
function displayRevenueChart(revenueData) {
  const chartContainer = document.getElementById("revenue-chart");
  if (!chartContainer) return;

  if (!revenueData || revenueData.length === 0) {
    chartContainer.innerHTML =
      '<p class="no-data">Chưa có dữ liệu doanh thu</p>';
    return;
  }

  const maxRevenue = Math.max(
    ...revenueData.map((item) => parseFloat(item.revenue))
  );

  let chartHTML = '<div class="simple-chart">';
  revenueData.forEach((item) => {
    const percentage =
      maxRevenue > 0 ? (parseFloat(item.revenue) / maxRevenue) * 100 : 0;
    chartHTML += `
      <div class="chart-row">
        <div class="chart-label">${item.month}</div>
        <div class="chart-bar-container">
          <div class="chart-bar" style="width: ${percentage}%"></div>
        </div>
        <div class="chart-value">${formatCurrency(item.revenue)}</div>
      </div>
    `;
  });
  chartHTML += "</div>";

  chartContainer.innerHTML = chartHTML;
}

// Hiển thị sản phẩm bán chạy
function displayTopProducts(products) {
  const container = document.getElementById("top-products");
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = '<p class="no-data">Chưa có dữ liệu</p>';
    return;
  }

  let html = '<div class="top-products-list">';
  products.forEach((product, index) => {
    html += `
      <div class="top-product-item">
        <span class="rank">#${index + 1}</span>
        <img src="${
          product.image || "../assets/images/placeholder.png"
        }" alt="${
      product.name
    }" onerror="this.src='../assets/images/placeholder.png'">
        <div class="product-info">
          <h4>${product.name}</h4>
          <p>Đã bán: ${product.total_sold} sản phẩm</p>
        </div>
      </div>
    `;
  });
  html += "</div>";

  container.innerHTML = html;
}

// Hiển thị thống kê đơn hàng theo trạng thái
function displayOrdersStatus(ordersStatus) {
  const container = document.getElementById("orders-status");
  if (!container) return;

  if (!ordersStatus || ordersStatus.length === 0) {
    container.innerHTML = '<p class="no-data">Chưa có đơn hàng</p>';
    return;
  }

  const statusMap = {
    pending: { label: "Chờ xử lý", icon: "clock", color: "#ffa500" },
    confirmed: { label: "Đã xác nhận", icon: "check-circle", color: "#4CAF50" },
    shipping: { label: "Đang giao", icon: "truck", color: "#2196F3" },
    completed: { label: "Hoàn thành", icon: "check-double", color: "#4CAF50" },
    cancelled: { label: "Đã hủy", icon: "times-circle", color: "#f44336" },
  };

  let html = '<div class="orders-status-list">';
  ordersStatus.forEach((item) => {
    const statusInfo = statusMap[item.status] || {
      label: item.status,
      icon: "info-circle",
      color: "#999",
    };
    html += `
      <div class="status-item">
        <i class="fas fa-${statusInfo.icon}" style="color: ${statusInfo.color}"></i>
        <span class="status-label">${statusInfo.label}</span>
        <span class="status-count">${item.count}</span>
      </div>
    `;
  });
  html += "</div>";

  container.innerHTML = html;
}

// Format tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
