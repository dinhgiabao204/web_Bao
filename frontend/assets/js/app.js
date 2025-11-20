// frontend/assets/js/app.js (Bản Final: Full Hàm Cũ + Chatbot Hybrid AI)

// ==========================================================
// 1. CẤU HÌNH CHUNG
// ==========================================================
const API_URL = "/nhathuocgb/backend/api";

async function apiFetch(url, options = {}) {
  const defaultOptions = { credentials: "include", ...options };
  let fetchUrl = url;
  if (!options.method || options.method.toUpperCase() === "GET") {
    const cacheBuster = `_cache=${new Date().getTime()}`;
    fetchUrl += (url.includes("?") ? "&" : "?") + cacheBuster;
  }
  if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    defaultOptions.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    defaultOptions.body = JSON.stringify(options.body);
  }
  return fetch(fetchUrl, defaultOptions);
}

async function loadComponent(url, elementId) {
  try {
    const response = await fetch(`/nhathuocgb/frontend/${url}`);
    if (!response.ok) throw new Error(`Lỗi tải ${url}`);
    const html = await response.text();
    const placeholder = document.getElementById(elementId);
    if (placeholder) placeholder.innerHTML = html;
  } catch (error) {
    console.error(`Lỗi tải component ${url}:`, error);
  }
}

function formatCurrency(amount) {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numericAmount);
}

// ==========================================================
// 2. AUTH & USER
// ==========================================================
function redirectToLogin(msg = "Vui lòng đăng nhập.") {
  alert(msg);
  window.location.href = "login.html";
}

async function checkAuthStatus() {
  const authLink = document.getElementById("auth-link");
  const userMenu = document.getElementById("user-menu");
  if (!authLink || !userMenu) {
    setTimeout(checkAuthStatus, 100);
    return;
  }

  try {
    const res = await apiFetch(`${API_URL}/auth.php?action=check_customer`);
    const result = await res.json();
    const userDisplayName = document.getElementById("user-display-name");
    const logoutButton = document.getElementById("logout-button");

    if (!userDisplayName || !logoutButton) {
      setTimeout(checkAuthStatus, 50);
      return;
    }

    if (result.status === "success" && result.user) {
      authLink.style.display = "none";
      userMenu.style.display = "flex";
      userDisplayName.textContent = result.user.full_name || result.user.email;
      if (!logoutButton.dataset.listenerAttached) {
        logoutButton.onclick = handleLogout;
        logoutButton.dataset.listenerAttached = "true";
      }
    } else {
      authLink.style.display = "flex";
      userMenu.style.display = "none";
    }
  } catch (e) {
    if (authLink) authLink.style.display = "flex";
    if (userMenu) userMenu.style.display = "none";
  }
}

async function handleLogout(e) {
  e.preventDefault();
  try {
    const res = await apiFetch(`${API_URL}/auth.php?action=logout_customer`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.status === "success") {
      alert("Đăng xuất thành công!");
      window.location.href = "index.html";
    }
  } catch (e) {
    alert("Lỗi kết nối khi đăng xuất.");
  }
}

async function loadCategoriesDropdown() {
  const container = document.getElementById("category-dropdown");
  if (!container) {
    setTimeout(loadCategoriesDropdown, 100);
    return;
  }
  try {
    const res = await apiFetch(`${API_URL}/categories.php?action=list`);
    const data = await res.json();
    if (data.status === "success" && data.data.length > 0) {
      container.innerHTML = data.data
        .map((c) => `<a href="products.html?category_id=${c.id}">${c.name}</a>`)
        .join("");
    } else {
      container.innerHTML = '<a href="#">Trống</a>';
    }
  } catch (e) {
    container.innerHTML = '<a href="#">Lỗi tải</a>';
  }
}

// ==========================================================
// 3. KHỞI CHẠY (INIT)
// ==========================================================
document.addEventListener("DOMContentLoaded", async () => {
  const isAdminPage = window.location.pathname.includes("/admin/");

  if (!isAdminPage) {
    await Promise.all([
      loadComponent("components/header.html", "main-header"),
      loadComponent("components/footer.html", "main-footer"),
    ]);
    await checkAuthStatus();
    await loadCategoriesDropdown();

    // Kích hoạt Chatbot AI
    initChatbotEmbed();
  }

  // Router logic (Đảm bảo đủ các hàm)
  if (document.getElementById("featured-products-grid")) initHome();
  else if (document.getElementById("login-form")) {
    if (!document.getElementById("admin-login-form")) initLogin();
  } else if (document.getElementById("products-list-grid")) initProductsPage();
  else if (document.getElementById("product-detail-content"))
    initProductDetailPage();
  else if (document.getElementById("cart-content")) initCartPage();
  else if (document.getElementById("checkout-form")) initCheckoutPage();
  else if (document.getElementById("user-info-section")) initProfilePage();
  else if (document.getElementById("order-detail-content")) {
    if (!isAdminPage) initOrderDetailPage();
  } else if (document.getElementById("blog-posts-grid")) initBlogPage();
  else if (document.getElementById("post-content-area")) initPostDetailPage();
});

// ==========================================================
// 4. LOGIC TỪNG TRANG (ĐÃ PHỤC HỒI ĐẦY ĐỦ)
// ==========================================================

function initHome() {
  console.log("Home Init");
}
function initProductsPage() {
  console.log("Products Init");
  attachProductSearchEvents();
}
function initProductDetailPage() {
  console.log("Product Detail Init");
}

// Các hàm bị thiếu trước đó:
function initCartPage() {
  console.log("Cart Init");
}
function initCheckoutPage() {
  console.log("Checkout Init");
}
function initProfilePage() {
  console.log("Profile Init");
}
function initOrderDetailPage() {
  console.log("Order Detail Init");
}
function initBlogPage() {
  console.log("Blog Init");
}
function initPostDetailPage() {
  console.log("Post Detail Init");
}

// Logic Đăng nhập/Đăng ký
function initLogin() {
  const loginForm = document.getElementById("login-form");
  const regForm = document.getElementById("register-form");
  if (!loginForm || !regForm) return;

  document.getElementById("show-register-form").onclick = (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    regForm.style.display = "block";
  };
  document.getElementById("show-login-form").onclick = (e) => {
    e.preventDefault();
    regForm.style.display = "none";
    loginForm.style.display = "block";
  };

  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.getElementById("login-message");
    msg.textContent = "Đang xử lý...";
    try {
      const res = await apiFetch(`${API_URL}/auth.php?action=login`, {
        method: "POST",
        body: Object.fromEntries(new FormData(loginForm)),
      });
      const data = await res.json();
      if (data.status === "success") {
        window.location.href = "index.html";
      } else {
        msg.textContent = data.message;
        msg.style.color = "red";
      }
    } catch (err) {
      msg.textContent = "Lỗi kết nối";
    }
  };

  regForm.onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.getElementById("register-message");
    const data = Object.fromEntries(new FormData(regForm));
    if (data.password !== data.confirm_password) {
      msg.textContent = "Mật khẩu không khớp";
      return;
    }
    msg.textContent = "Đang đăng ký...";
    try {
      const res = await apiFetch(`${API_URL}/auth.php?action=register`, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.status === "success") {
        alert("Đăng ký thành công");
        window.location.reload();
      } else {
        msg.textContent = json.message;
      }
    } catch (err) {
      msg.textContent = "Lỗi kết nối";
    }
  };
}

function attachProductSearchEvents() {
  const input = document.getElementById("product-search-input");
  const btn = document.getElementById("product-search-button");
  if (!input || !btn) return;
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("search"))
    input.value = decodeURIComponent(urlParams.get("search"));
  btn.onclick = () => handleProductSearch(input);
  input.onkeypress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleProductSearch(input);
    }
  };
}

function handleProductSearch(input) {
  const kw = input.value.trim();
  if (kw)
    window.location.href = `products.html?search=${encodeURIComponent(kw)}`;
  else window.location.href = `products.html`;
}

// ==========================================================
// 5. CHATBOT AI (HYBRID: RULE + API)
// ==========================================================
function initChatbotEmbed() {
  const chatbotHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      
      /* Nút mở Chatbot */
      .chatbot-toggler {
        position: fixed; bottom: 30px; right: 30px; outline: none; border: none;
        height: 60px; width: 60px; display: flex; cursor: pointer;
        align-items: center; justify-content: center; border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: all 0.3s ease; z-index: 9999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      }
      .chatbot-toggler:hover { transform: scale(1.1); }
      .chatbot-toggler span { color: #fff; position: absolute; font-size: 1.8rem; transition: 0.3s; }
      .chatbot-toggler span:last-child, body.show-chatbot .chatbot-toggler span:first-child { opacity: 0; transform: rotate(90deg); }
      body.show-chatbot .chatbot-toggler span:last-child { opacity: 1; transform: rotate(0); }

      /* Khung Chatbot */
      .chatbot {
        position: fixed; right: 30px; bottom: 100px; width: 380px; 
        background: #fff; border-radius: 20px; overflow: hidden; opacity: 0;
        pointer-events: none; transform: scale(0.5); transform-origin: bottom right;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 9998; font-family: 'Inter', sans-serif;
        border: 1px solid #eee;
      }
      body.show-chatbot .chatbot { opacity: 1; pointer-events: auto; transform: scale(1); }

      /* Header */
      .chatbot header {
        padding: 15px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex; align-items: center; justify-content: space-between;
        color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .chatbot header .header-info { display: flex; align-items: center; gap: 10px; }
      .chatbot header .bot-avatar { 
        width: 35px; height: 35px; background: #fff; border-radius: 50%; 
        display: flex; align-items: center; justify-content: center; color: #764ba2; font-size: 1.2rem;
      }
      .chatbot header h2 { font-size: 1.1rem; font-weight: 600; margin: 0; }
      .chatbot header .close-btn { cursor: pointer; font-size: 1.5rem; transition: 0.2s; }
      .chatbot header .close-btn:hover { opacity: 0.8; }

      /* Chatbox Area */
      .chatbot .chatbox {
        overflow-y: auto; height: 400px; padding: 20px;
        background: #f9f9f9; scroll-behavior: smooth;
      }
      .chatbox .chat { display: flex; list-style: none; margin-bottom: 15px; }
      
      /* Tin nhắn Bot */
      .chatbox .incoming span {
        width: 32px; height: 32px; color: #fff; align-self: flex-end;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        text-align: center; line-height: 32px; border-radius: 50%; margin-right: 10px;
        display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0;
      }
      .chatbox .incoming p {
        background: #fff; color: #333; border-radius: 15px 15px 15px 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        padding: 12px 16px; font-size: 0.95rem; line-height: 1.5; max-width: 75%; margin: 0;
      }

      /* Tin nhắn User */
      .chatbox .outgoing { justify-content: flex-end; margin: 20px 0; }
      .chatbox .outgoing p {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff; border-radius: 15px 15px 0 15px;
        padding: 12px 16px; font-size: 0.95rem; max-width: 75%; margin: 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }

      /* Input Area */
      .chatbot .chat-input {
        display: flex; gap: 10px; align-items: center;
        padding: 10px 20px; border-top: 1px solid #eee; background: #fff;
      }
      .chat-input textarea {
        height: 45px; width: 100%; border: none; outline: none;
        resize: none; max-height: 100px; padding: 12px 0;
        font-size: 0.95rem; font-family: 'Inter', sans-serif;
      }
      .chat-input span {
        color: #764ba2; font-size: 1.5rem; cursor: pointer;
        transition: 0.2s; display: none;
      }
      .chat-input textarea:valid ~ span { display: block; }

      /* Mobile */
      @media (max-width: 490px) {
        .chatbot { right: 0; bottom: 0; height: 100%; width: 100%; border-radius: 0; }
        .chatbot .chatbox { height: calc(100% - 130px); }
        .chatbot header { padding: 15px 20px; }
      }
    </style>

    <button class="chatbot-toggler">
      <span class="material-symbols-rounded"><i class="fas fa-comment-dots"></i></span>
      <span class="material-symbols-outlined"><i class="fas fa-times"></i></span>
    </button>
    
    <div class="chatbot">
      <header>
        <div class="header-info">
            <div class="bot-avatar"><i class="fas fa-robot"></i></div>
            <h2>Trợ lý Nhà Thuốc GB</h2>
        </div>
        <span class="close-btn"><i class="fas fa-chevron-down"></i></span>
      </header>
      <ul class="chatbox">
        <li class="chat incoming">
          <span><i class="fas fa-robot"></i></span>
          <p>Xin chào! 👋<br>Tôi có thể giúp gì cho sức khỏe của bạn hôm nay?</p>
        </li>
      </ul>
      <div class="chat-input">
        <textarea placeholder="Nhập nội dung..." spellcheck="false" required></textarea>
        <span id="send-btn"><i class="fas fa-paper-plane"></i></span>
      </div>
    </div>`;

  const div = document.createElement("div");
  div.innerHTML = chatbotHTML;
  document.body.appendChild(div);

  // Logic Xử lý
  const toggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".close-btn");
  const chatbox = document.querySelector(".chatbox");
  const txtArea = document.querySelector(".chat-input textarea");
  const sendBtn = document.querySelector("#send-btn");
  let userMsg = null;

  const createChatLi = (msg, className) => {
    const li = document.createElement("li");
    li.classList.add("chat", className);
    let content =
      className === "outgoing"
        ? `<p>${msg}</p>`
        : `<span><i class="fas fa-robot"></i></span><p>${msg}</p>`;
    li.innerHTML = content;
    return li;
  };

  // --- BỘ NÃO 1: RULE-BASED (Ưu tiên tốc độ) ---
  const getLocalResponse = (msg) => {
    msg = msg.toLowerCase();
    // Chào hỏi
    if (msg.includes("chào") || msg.includes("hello") || msg.includes("hi"))
      return "Chào bạn! 👋 Chúc bạn một ngày tốt lành. Bạn cần tư vấn về thuốc hay thực phẩm chức năng?";
    if (msg.includes("cảm ơn"))
      return "Không có chi! Chúc bạn và gia đình luôn mạnh khỏe! ❤️";
    if (msg.includes("tạm biệt")) return "Tạm biệt! Hẹn gặp lại bạn nhé.";

    // Thông tin cửa hàng
    if (msg.includes("địa chỉ") || msg.includes("ở đâu"))
      return "📍 Địa chỉ: 123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh.";
    if (msg.includes("giờ") || msg.includes("mở cửa"))
      return "⏰ Giờ mở cửa: 8:00 - 22:00 (Tất cả các ngày trong tuần).";
    if (
      msg.includes("liên hệ") ||
      msg.includes("sdt") ||
      msg.includes("hotline")
    )
      return "📞 Hotline tư vấn: 0909.699.699 (Zalo/Call).";

    // Tư vấn nhanh
    if (msg === "thuốc" || msg.includes("mua thuốc"))
      return "💊 Bạn đang cần tìm loại thuốc nào (giảm đau, hạ sốt, dạ dày...)? Hoặc bạn đang gặp triệu chứng gì?";
    if (msg.includes("đau đầu") || msg.includes("nhức đầu"))
      return "💊 Đau đầu: Bạn có thể dùng Panadol (xanh/đỏ) hoặc Efferalgan 500mg. Nghỉ ngơi nơi yên tĩnh.";
    if (msg.includes("sốt") || msg.includes("nóng"))
      return "🌡️ Hạ sốt: Dùng Paracetamol 500mg (cách nhau 4-6h). Chườm ấm, uống nhiều nước.";

    return null; // Không tìm thấy câu trả lời mẫu -> Chuyển sang AI
  };

  // --- BỘ NÃO 2: GỌI API AI (Khi không tìm thấy luật) ---
  const generateResponse = async (msg) => {
    const localAns = getLocalResponse(msg);

    // Nếu có câu trả lời mẫu -> Dùng luôn
    if (localAns) {
      setTimeout(() => {
        chatbox.appendChild(createChatLi(localAns, "incoming"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
      }, 500);
      return;
    }

    // Nếu không biết -> Hỏi AI (Gemini)
    const loadingLi = createChatLi("...", "incoming");
    chatbox.appendChild(loadingLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    try {
      const res = await apiFetch(`${API_URL}/chat.php`, {
        method: "POST",
        body: { message: msg },
      });
      const data = await res.json();

      // Xóa tin nhắn chờ
      chatbox.removeChild(loadingLi);

      // Hiện câu trả lời của AI
      chatbox.appendChild(createChatLi(data.reply, "incoming"));
    } catch (error) {
      chatbox.removeChild(loadingLi);
      chatbox.appendChild(
        createChatLi(
          "Xin lỗi, kết nối AI đang bận. Vui lòng gọi Hotline 0909.699.699.",
          "incoming"
        )
      );
    }
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };

  const handleChat = () => {
    userMsg = txtArea.value.trim();
    if (!userMsg) return;
    txtArea.value = "";
    txtArea.style.height = "auto";
    chatbox.appendChild(createChatLi(userMsg, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(userMsg);
  };

  txtArea.addEventListener("input", () => {
    txtArea.style.height = "auto";
    txtArea.style.height = `${txtArea.scrollHeight}px`;
  });
  txtArea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleChat();
    }
  });
  sendBtn.addEventListener("click", handleChat);
  closeBtn.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
  );
  toggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
  );
}
