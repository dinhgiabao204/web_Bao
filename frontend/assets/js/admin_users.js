// frontend/assets/js/admin_users.js (ĐÃ SỬA LỖI)

// Biến toàn cục
let allUsers = [];
let currentPage = 1;
let itemsPerPage = 10;

async function initAdminUsers() {
  await loadUsersIntoTable();
  attachModalEvents();
  attachFormSubmitEvent();
  attachTableEvents();
}

// 1. TẢI DỮ LIỆU
async function loadUsers() {
  try {
    const response = await apiFetch(`${API_URL}/users.php`);
    const result = await response.json();

    if (result.status === "success") {
      allUsers = result.data;
      displayUsers(allUsers);
    } else {
      showError("Không thể tải danh sách người dùng");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showError("Lỗi kết nối server");
  }
}

async function loadUsersIntoTable() {
  const tableBody = document.getElementById("users-table-body");
  if (!tableBody) return;
  tableBody.innerHTML =
    '<tr><td colspan="7" class="text-center">Đang tải...</td></tr>';

  try {
    const response = await apiFetch(`${API_URL}/users.php?action=admin_list`);
    const result = await response.json();

    if (result.status === "success" && result.data) {
      renderUsersTable(result.data);
    } else {
      tableBody.innerHTML = `<tr><td colspan="7" class="error-message text-center">Lỗi: ${result.message}</td></tr>`;
    }
  } catch (error) {
    console.error("Lỗi tải người dùng:", error);
    if (error.response && error.response.status !== 401) {
      tableBody.innerHTML = `<tr><td colspan="7" class="error-message text-center">Lỗi kết nối khi tải người dùng.</td></tr>`;
    }
  }
}

// 2. RENDER (VẼ GIAO DIỆN)
function renderUsersTable(users) {
  const tableBody = document.getElementById("users-table-body");
  if (!users || users.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="7" class="text-center">Không có người dùng nào.</td></tr>';
    return;
  }

  tableBody.innerHTML = "";
  users.forEach((user) => {
    const statusText = user.status == 1 ? "Hoạt động" : "Bị khóa";
    const statusClass = user.status == 1 ? "active" : "inactive";
    const roleText = user.role === "admin" ? "Admin" : "Khách hàng";

    const row = `
      <tr data-user-id="${user.id}">
        <td>${user.id}</td>
        <td>${user.full_name}</td>
        <td>${user.email}</td>
        <td>${user.phone || "---"}</td>
        <td>${roleText}</td>
        <td>
          <span class="status-dot ${statusClass}" title="${statusText}"></span>
        </td>
        <td class="action-buttons">
          <button class="btn-edit" title="Sửa quyền/trạng thái"><i class="fas fa-user-shield"></i></button>
          <button class="btn-delete" title="Xóa người dùng"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// 3. GẮN SỰ KIỆN
function attachModalEvents() {
  const modal = document.getElementById("user-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  if (!modal || !closeBtn) return;

  // Đóng modal khi click nút X
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  // Đóng modal khi click bên ngoài
  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.classList.remove("show");
    }
  });
}

function attachTableEvents() {
  const tableBody = document.getElementById("users-table-body");
  if (!tableBody) return;

  tableBody.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-edit");
    const deleteBtn = e.target.closest(".btn-delete");

    if (editBtn) {
      const row = editBtn.closest("tr");
      const userId = row.dataset.userId;
      await handleEditUser(userId);
    }

    if (deleteBtn) {
      const row = deleteBtn.closest("tr");
      const userId = row.dataset.userId;
      const userName = row.cells[1].textContent;
      if (
        confirm(
          `Bạn có chắc muốn XÓA vĩnh viễn người dùng "${userName}"? Mọi đơn hàng của họ cũng có thể bị ảnh hưởng.`
        )
      ) {
        await handleDeleteUser(userId);
      }
    }
  });
}

function attachFormSubmitEvent() {
  const form = document.getElementById("user-form");
  const messageP = document.getElementById("user-form-message");
  if (!form || !messageP) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageP.textContent = "Đang lưu...";
    messageP.style.color = "blue";

    const userId = document.getElementById("user_id").value;
    const newRole = document.getElementById("user_role").value;
    const newStatus = document.getElementById("user_status").value;

    try {
      const response = await apiFetch(
        `${API_URL}/users.php?action=update_role_status`,
        {
          method: "POST",
          body: {
            id: parseInt(userId),
            role: newRole,
            status: parseInt(newStatus),
          },
        }
      );
      const result = await response.json();

      if (result.status === "success") {
        messageP.textContent = "Cập nhật thành công!";
        messageP.style.color = "green";
        await loadUsersIntoTable();
        setTimeout(() => {
          document.getElementById("user-modal").classList.remove("show");
        }, 1000);
      } else {
        messageP.textContent = `Lỗi: ${result.message}`;
        messageP.style.color = "red";
      }
    } catch (error) {
      console.error("Lỗi submit form user:", error);
      messageP.textContent = "Lỗi kết nối. Vui lòng thử lại.";
      messageP.style.color = "red";
    }
  });
}

// 4. HÀM XỬ LÝ LOGIC (Sửa/Xóa)
async function handleEditUser(userId) {
  const messageP = document.getElementById("user-form-message");
  messageP.textContent = "Đang tải dữ liệu...";
  messageP.style.color = "blue";

  resetForm();
  document.getElementById(
    "modal-title"
  ).textContent = `Sửa người dùng (ID: ${userId})`;

  // Hiển thị modal bằng class "show"
  document.getElementById("user-modal").classList.add("show");

  try {
    const response = await apiFetch(
      `${API_URL}/users.php?action=admin_detail&id=${userId}`
    );
    const result = await response.json();

    if (result.status === "success" && result.data) {
      const user = result.data;
      document.getElementById("user_id").value = user.id;
      document.getElementById("user_fullname").value = user.full_name;
      document.getElementById("user_email").value = user.email;
      document.getElementById("user_role").value = user.role;
      document.getElementById("user_status").value = user.status;
      messageP.textContent = "";
    } else {
      messageP.textContent = `Lỗi: ${result.message}`;
      messageP.style.color = "red";
    }
  } catch (error) {
    console.error("Lỗi tải chi tiết user:", error);
    messageP.textContent = "Lỗi kết nối khi tải chi tiết người dùng.";
    messageP.style.color = "red";
  }
}

async function handleDeleteUser(userId) {
  try {
    const response = await apiFetch(`${API_URL}/users.php?action=delete`, {
      method: "POST",
      body: { id: parseInt(userId) },
    });
    const result = await response.json();
    if (result.status === "success") {
      alert("Đã xóa người dùng thành công.");
      await loadUsersIntoTable();
    } else {
      alert(`Lỗi khi xóa: ${result.message}`);
    }
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    alert("Lỗi kết nối khi xóa người dùng.");
  }
}

// Hàm reset form modal
function resetForm() {
  const form = document.getElementById("user-form");
  form.reset();
  document.getElementById("user_id").value = "";
  document.getElementById("user-form-message").textContent = "";
}

// Gọi hàm init chính
initAdminUsers();

// Setup các event listener
function setupEventListeners() {
  // Tìm kiếm
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterUsers(e.target.value);
    });
  }

  // Lọc theo role
  const roleFilter = document.getElementById("role-filter");
  if (roleFilter) {
    roleFilter.addEventListener("change", (e) => {
      filterUsersByRole(e.target.value);
    });
  }

  // Lọc theo status
  const statusFilter = document.getElementById("status-filter");
  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      filterUsersByStatus(e.target.value);
    });
  }
}

// Hiển thị danh sách người dùng
function displayUsers(users) {
  const tbody = document.getElementById("users-tbody");
  if (!tbody) return;

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 30px;">
          Không có người dùng nào
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = users
    .map(
      (user) => `
    <tr>
      <td>${user.id}</td>
      <td>${escapeHtml(user.full_name || "---")}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${user.phone || "---"}</td>
      <td>
        <span class="badge badge-${user.role === "admin" ? "danger" : "info"}">
          ${user.role === "admin" ? "Admin" : "Khách hàng"}
        </span>
      </td>
      <td>
        <span class="status-dot ${
          user.status === "active" ? "active" : "inactive"
        }"></span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn-action btn-view" onclick="viewUser(${
            user.id
          })" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-action btn-edit" onclick="editUser(${
            user.id
          })" title="Sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-action btn-delete" onclick="deleteUser(${
            user.id
          })" title="Xóa">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `
    )
    .join("");
}

// Xem chi tiết người dùng
async function viewUser(userId) {
  try {
    const response = await apiFetch(`${API_URL}/users.php?id=${userId}`);
    const result = await response.json();

    if (result.status === "success") {
      const user = result.data;
      showUserModal(user, "view");
    } else {
      showError(result.message);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showError("Không thể tải thông tin người dùng");
  }
}

// Sửa người dùng
async function editUser(userId) {
  try {
    const response = await apiFetch(`${API_URL}/users.php?id=${userId}`);
    const result = await response.json();

    if (result.status === "success") {
      const user = result.data;
      showUserModal(user, "edit");
    } else {
      showError(result.message);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showError("Không thể tải thông tin người dùng");
  }
}

// Hiển thị modal
function showUserModal(user, mode) {
  const isView = mode === "view";
  const modalHTML = `
    <div class="modal-overlay" id="user-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>${isView ? "Thông tin người dùng" : "Chỉnh sửa người dùng"}</h2>
          <button class="btn-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="user-form">
            <div class="form-group">
              <label>Họ và tên:</label>
              <input type="text" name="full_name" value="${escapeHtml(
                user.full_name || ""
              )}" ${isView ? "readonly" : ""} required>
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input type="email" value="${escapeHtml(user.email)}" readonly>
            </div>
            <div class="form-group">
              <label>Số điện thoại:</label>
              <input type="tel" name="phone" value="${user.phone || ""}" ${
    isView ? "readonly" : ""
  }>
            </div>
            <div class="form-group">
              <label>Địa chỉ:</label>
              <textarea name="address" ${isView ? "readonly" : ""}>${escapeHtml(
    user.address || ""
  )}</textarea>
            </div>
            <div class="form-group">
              <label>Quyền:</label>
              <select name="role" ${isView || user.id === 1 ? "disabled" : ""}>
                <option value="customer" ${
                  user.role === "customer" ? "selected" : ""
                }>Khách hàng</option>
                <option value="admin" ${
                  user.role === "admin" ? "selected" : ""
                }>Admin</option>
              </select>
            </div>
            <div class="form-group">
              <label>Trạng thái:</label>
              <select name="status" ${isView ? "disabled" : ""}>
                <option value="active" ${
                  user.status === "active" ? "selected" : ""
                }>Hoạt động</option>
                <option value="inactive" ${
                  user.status === "inactive" ? "selected" : ""
                }>Vô hiệu hóa</option>
              </select>
            </div>
            ${
              !isView
                ? `
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Hủy</button>
                <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
              </div>
            `
                : ""
            }
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  if (!isView) {
    document.getElementById("user-form").addEventListener("submit", (e) => {
      e.preventDefault();
      saveUser(user.id, new FormData(e.target));
    });
  }
}

// Lưu thông tin người dùng
async function saveUser(userId, formData) {
  try {
    const data = {
      id: userId,
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      role: formData.get("role"),
      status: formData.get("status"),
    };

    const response = await apiFetch(`${API_URL}/users.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.status === "success") {
      showSuccess("Cập nhật thành công!");
      closeModal();
      await loadUsers();
    } else {
      showError(result.message);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showError("Không thể cập nhật người dùng");
  }
}

// Xóa người dùng
async function deleteUser(userId) {
  if (userId === 1) {
    showError("Không thể xóa tài khoản Admin chính!");
    return;
  }

  if (!confirm("Bạn có chắc muốn xóa người dùng này?")) {
    return;
  }

  try {
    const response = await apiFetch(`${API_URL}/users.php?id=${userId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.status === "success") {
      showSuccess("Xóa người dùng thành công!");
      await loadUsers();
    } else {
      showError(result.message);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showError("Không thể xóa người dùng");
  }
}

// Đóng modal
function closeModal() {
  const modal = document.getElementById("user-modal");
  if (modal) {
    modal.remove();
  }
}

// Lọc người dùng
function filterUsers(searchTerm) {
  const filtered = allUsers.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );
  displayUsers(filtered);
}

function filterUsersByRole(role) {
  if (role === "all") {
    displayUsers(allUsers);
  } else {
    const filtered = allUsers.filter((user) => user.role === role);
    displayUsers(filtered);
  }
}

function filterUsersByStatus(status) {
  if (status === "all") {
    displayUsers(allUsers);
  } else {
    const filtered = allUsers.filter((user) => user.status === status);
    displayUsers(filtered);
  }
}

// Hiện thông báo
function showSuccess(message) {
  alert(message);
}

function showError(message) {
  alert("Lỗi: " + message);
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
