// frontend/assets/js/admin_users.js
// Yêu cầu: biến API_URL được định nghĩa trong app.js

async function initAdminUsers() {
  await loadUsersIntoTable();
  attachModalEvents();
  attachFormSubmitEvent();
  attachTableEvents();
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
    console.error("Lỗi tải users admin:", error);
    tableBody.innerHTML =
      '<tr><td colspan="7" class="error-message text-center">Lỗi kết nối khi tải users.</td></tr>';
  }
}

function renderUsersTable(users) {
  const tableBody = document.getElementById("users-table-body");
  if (!users || users.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="7" class="text-center">Chưa có user nào.</td></tr>';
    return;
  }
  tableBody.innerHTML = "";
  users.forEach((u) => {
    const row = `
      <tr data-user-id="${u.id}">
        <td>${u.id}</td>
        <td>${u.full_name || "---"}</td>
        <td>${u.email}</td>
        <td>${u.phone || "---"}</td>
        <td>${u.role}</td>
        <td><span class="status-dot ${
          u.status == 1 ? "active" : "inactive"
        }"></span></td>
        <td class="action-buttons">
          <button class="btn-edit" title="Sửa"><i class="fas fa-edit"></i></button>
          <button class="btn-delete" title="Xóa"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
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
        confirm(`Bạn có chắc muốn XÓA (ẩn) user "${userName}" (ID: ${userId})?`)
      ) {
        await handleDeleteUser(userId);
      }
    }
  });
}

async function handleEditUser(userId) {
  const messageP = document.getElementById("user-form-message");
  if (!messageP) return;
  messageP.textContent = "Đang tải dữ liệu user...";
  messageP.style.color = "blue";

  resetForm();
  const modal = document.getElementById("user-modal");
  const modalTitle = document.getElementById("modal-title");
  if (modal && modalTitle) {
    modalTitle.textContent = `Sửa user (ID: ${userId})`;
    modal.style.display = "flex";
  }

  try {
    const response = await apiFetch(
      `${API_URL}/users.php?action=admin_detail&id=${userId}`
    );
    const result = await response.json();
    if (result.status === "success" && result.data) {
      const u = result.data;
      document.getElementById("user_id").value = u.id;
      document.getElementById("user_fullname").value = u.full_name || "";
      document.getElementById("user_email").value = u.email || "";
      document.getElementById("user_phone").value = u.phone || "";
      document.getElementById("user_role").value = u.role || "customer";
      document.getElementById("user_status").value = u.status || 1;
      messageP.textContent = "";
    } else {
      messageP.textContent = `Lỗi: ${result.message}`;
      messageP.style.color = "red";
    }
  } catch (error) {
    console.error("Lỗi tải chi tiết user:", error);
    messageP.textContent = "Lỗi kết nối khi tải chi tiết user.";
    messageP.style.color = "red";
  }
}

function resetForm() {
  const form = document.getElementById("user-form");
  if (!form) return;
  form.reset();
  document.getElementById("user_id").value = "";
  const messageP = document.getElementById("user-form-message");
  if (messageP) messageP.textContent = "";
}

function attachFormSubmitEvent() {
  const form = document.getElementById("user-form");
  const messageP = document.getElementById("user-form-message");
  if (!form || !messageP) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageP.textContent = "Đang lưu...";
    messageP.style.color = "blue";

    const formData = new FormData(form);
    const userId = formData.get("id");
    let apiUrl = userId
      ? `${API_URL}/users.php?action=update`
      : `${API_URL}/users.php?action=create`;
    let successMessage = userId
      ? "Cập nhật user thành công!"
      : "Thêm user thành công!";

    try {
      const response = await apiFetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.status === "success") {
        messageP.textContent = successMessage;
        messageP.style.color = "green";
        await loadUsersIntoTable();
        setTimeout(() => {
          const modal = document.getElementById("user-modal");
          if (modal) modal.style.display = "none";
        }, 800);
      } else {
        messageP.textContent = `Lỗi: ${result.message}`;
        messageP.style.color = "red";
      }
    } catch (error) {
      console.error("Lỗi submit user form:", error);
      messageP.textContent = "Lỗi kết nối. Vui lòng thử lại.";
      messageP.style.color = "red";
    }
  });
}

async function handleDeleteUser(userId) {
  try {
    const response = await apiFetch(`${API_URL}/users.php?action=delete`, {
      method: "POST",
      body: JSON.stringify({ id: parseInt(userId) }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result.status === "success") {
      alert("Đã ẩn user thành công.");
      await loadUsersIntoTable();
    } else {
      alert(`Lỗi khi xóa: ${result.message}`);
    }
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    alert("Lỗi kết nối khi xóa user.");
  }
}

const attachModalEvents = () => {
  const modal = document.getElementById("user-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target == modal) modal.style.display = "none";
  });
};

initAdminUsers();
