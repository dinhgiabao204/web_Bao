// frontend/assets/js/app.js (Bản Final: Full Hàm Cũ + Chatbot Hybrid AI + Big Data)

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

    // Kích hoạt Chatbot
    initChatbotEmbed();
  }

  // Router logic
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
// 4. LOGIC TRANG
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
// Các hàm placeholder cũ
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
// 5. CHATBOT AI (GIAO DIỆN COMPACT & DỮ LIỆU PHONG PHÚ)
// ==========================================================
function initChatbotEmbed() {
  const chatbotHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      
      /* Nút mở Chatbot - Đã thu nhỏ */
      .chatbot-toggler {
        position: fixed; bottom: 30px; right: 30px; outline: none; border: none;
        height: 50px; width: 50px; display: flex; cursor: pointer;
        align-items: center; justify-content: center; border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: all 0.3s ease; z-index: 9999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      }
      .chatbot-toggler:hover { transform: scale(1.1); }
      .chatbot-toggler span { color: #fff; position: absolute; font-size: 1.5rem; transition: 0.3s; }
      .chatbot-toggler span:last-child, body.show-chatbot .chatbot-toggler span:first-child { opacity: 0; transform: rotate(90deg); }
      body.show-chatbot .chatbot-toggler span:last-child { opacity: 1; transform: rotate(0); }

      /* Khung Chatbot - Đã thu nhỏ & hạ thấp */
      .chatbot {
        position: fixed; right: 30px; bottom: 90px;
        width: 340px;
        background: #fff; border-radius: 15px; overflow: hidden; opacity: 0;
        pointer-events: none; transform: scale(0.5); transform-origin: bottom right;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 9998; font-family: 'Inter', sans-serif;
        border: 1px solid #eee;
      }
      body.show-chatbot .chatbot { opacity: 1; pointer-events: auto; transform: scale(1); }

      /* Header */
      .chatbot header {
        padding: 12px 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex; align-items: center; justify-content: space-between;
        color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      }
      .chatbot header .header-info { display: flex; align-items: center; gap: 10px; }
      .chatbot header .bot-avatar { 
        width: 30px; height: 30px; background: #fff; border-radius: 50%; 
        display: flex; align-items: center; justify-content: center; color: #764ba2; font-size: 1rem;
      }
      .chatbot header h2 { font-size: 1rem; font-weight: 600; margin: 0; }
      .chatbot header .close-btn { cursor: pointer; font-size: 1.2rem; transition: 0.2s; }
      .chatbot header .close-btn:hover { opacity: 0.8; }

      /* Chatbox Area */
      .chatbot .chatbox {
        overflow-y: auto; height: 320px;
        padding: 15px; background: #f9f9f9; scroll-behavior: smooth;
      }
      .chatbox .chat { display: flex; list-style: none; margin-bottom: 12px; }
      
      /* Tin nhắn Bot */
      .chatbox .incoming span {
        width: 28px; height: 28px; color: #fff; align-self: flex-end;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        text-align: center; line-height: 28px; border-radius: 50%; margin-right: 8px;
        display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0;
      }
      .chatbox .incoming p {
        background: #fff; color: #333; border-radius: 12px 12px 12px 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        padding: 10px 14px; font-size: 0.9rem; line-height: 1.4; max-width: 80%; margin: 0;
      }

      /* Tin nhắn User */
      .chatbox .outgoing { justify-content: flex-end; margin: 15px 0; }
      .chatbox .outgoing p {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff; border-radius: 12px 12px 0 12px;
        padding: 10px 14px; font-size: 0.9rem; max-width: 80%; margin: 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }

      /* Input Area */
      .chatbot .chat-input {
        display: flex; gap: 10px; align-items: center;
        padding: 8px 15px; border-top: 1px solid #eee; background: #fff;
      }
      .chat-input textarea {
        height: 40px; width: 100%; border: none; outline: none;
        resize: none; max-height: 80px; padding: 10px 0;
        font-size: 0.9rem; font-family: 'Inter', sans-serif;
      }
      .chat-input span {
        color: #764ba2; font-size: 1.4rem; cursor: pointer;
        transition: 0.2s; display: none;
      }
      .chat-input textarea:valid ~ span { display: block; }

      /* Mobile */
      @media (max-width: 490px) {
        .chatbot { right: 0; bottom: 0; height: 100%; width: 100%; border-radius: 0; }
        .chatbot .chatbox { height: calc(100% - 110px); }
        .chatbot header { padding: 12px 15px; }
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
          <p>Xin chào! 👋<br>Mình có thể giúp gì cho bạn hôm nay?</p>
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

  // --- BỘ NÃO 1: RULE-BASED (Ưu tiên tốc độ - Dữ liệu mẫu phong phú) ---
  const getLocalResponse = (msg) => {
    msg = msg.toLowerCase();

    // 1. TỪ KHÓA NGẮN & CHUNG CHUNG (Fix lỗi người dùng lười gõ)
    if (
      msg === "thuốc" ||
      msg.includes("mua thuốc") ||
      msg.includes("bán thuốc")
    )
      return "💊 Bạn đang cần tìm loại thuốc nào (giảm đau, hạ sốt, dạ dày, hay vitamin...)? Hoặc bạn đang gặp triệu chứng gì? Hãy mô tả để mình tư vấn nhé!";
    if (msg.includes("tpcn") || msg.includes("thực phẩm chức năng"))
      return "🌿 Bên mình có Vitamin, Bổ não, Xương khớp, Làm đẹp... Bạn quan tâm nhóm nào ạ?";
    if (
      msg === "có" ||
      msg === "ok" ||
      msg === "được" ||
      msg === "vâng" ||
      msg === "dạ"
    )
      return "Dạ, vậy bạn hãy nói rõ hơn nhu cầu của mình để mình hỗ trợ tốt nhất nhé! 😊";
    if (msg === "không" || msg === "khong" || msg === "ko")
      return "Vâng ạ, nếu cần hỗ trợ gì khác bạn cứ nhắn mình nhé! Chúc bạn nhiều sức khỏe.";
    if (msg.includes("tư vấn") && msg.length < 10)
      return "Bạn cần tư vấn về bệnh lý hay sản phẩm nào ạ? Hãy mô tả triệu chứng hoặc tên thuốc nhé.";

    // 2. CHÀO HỎI & XÃ GIAO
    if (
      msg.includes("chào") ||
      msg.includes("hello") ||
      msg.includes("hi") ||
      msg.includes("alo")
    )
      return "Chào bạn! 👋 Chúc bạn một ngày tốt lành. Bạn cần tư vấn về sức khỏe hay tìm mua sản phẩm nào?";
    if (msg.includes("cảm ơn") || msg.includes("thanks"))
      return "Không có chi! Chúc bạn và gia đình luôn mạnh khỏe! ❤️";
    if (msg.includes("tạm biệt") || msg.includes("bye"))
      return "Tạm biệt! Hẹn gặp lại bạn nhé.";
    if (msg.includes("ngu") || msg.includes("dở") || msg.includes("cùi"))
      return "Xin lỗi nếu mình làm bạn không hài lòng. Mình là AI đang học việc, mình sẽ cố gắng cải thiện hơn! 😔";
    if (msg.includes("tên gì") || msg.includes("là ai"))
      return "Mình là Trợ lý ảo của Nhà thuốc GB, túc trực 24/7 để hỗ trợ bạn!";

    // 3. THÔNG TIN NHÀ THUỐC & LIÊN HỆ
    if (
      msg.includes("địa chỉ") ||
      msg.includes("ở đâu") ||
      msg.includes("đến tiệm")
    )
      return "📍 Địa chỉ nhà thuốc: 123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh. Mời bạn ghé thăm ạ!";
    if (
      msg.includes("giờ") ||
      msg.includes("mở cửa") ||
      msg.includes("đóng cửa")
    )
      return "⏰ Giờ mở cửa: 8:00 - 22:00 (Tất cả các ngày trong tuần, kể cả Chủ Nhật).";
    if (
      msg.includes("liên hệ") ||
      msg.includes("sdt") ||
      msg.includes("hotline") ||
      msg.includes("điện thoại")
    )
      return "📞 Hotline tư vấn & đặt hàng: 0909.699.699 (Zalo/Call).";
    if (msg.includes("facebook") || msg.includes("fanpage"))
      return "Bạn có thể ghé thăm Fanpage của chúng mình tại: facebook.com/DinhGiaBao.info";

    // 4. CHÍNH SÁCH & DỊCH VỤ (Web related)
    if (
      msg.includes("giao hàng") ||
      msg.includes("ship") ||
      msg.includes("vận chuyển")
    )
      return "🚚 Nhà thuốc GB miễn phí giao hàng cho đơn từ 500k. Giao nội thành HCM trong 2h, tỉnh 2-3 ngày.";
    if (msg.includes("thanh toán") || msg.includes("trả tiền"))
      return "💳 Bạn có thể thanh toán tiền mặt khi nhận hàng (COD) hoặc chuyển khoản ngân hàng qua QR code.";
    if (msg.includes("đổi trả") || msg.includes("bảo hành"))
      return "🔄 Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm lỗi do nhà sản xuất. Vui lòng giữ lại hóa đơn nhé.";
    if (
      msg.includes("tài khoản") ||
      msg.includes("đăng ký") ||
      msg.includes("đăng nhập")
    )
      return "👤 Bạn có thể Đăng ký/Đăng nhập ở góc trên bên phải màn hình để theo dõi đơn hàng và tích điểm nhé.";
    if (msg.includes("quên mật khẩu"))
      return "🔑 Nếu quên mật khẩu, bạn hãy nhấn vào 'Quên mật khẩu' tại trang Đăng nhập hoặc liên hệ Hotline để được cấp lại.";

    // 5. TƯ VẤN BỆNH LÝ THƯỜNG GẶP (Medical)
    // - Đau/Sốt
    if (msg.includes("đau đầu") || msg.includes("nhức đầu"))
      return "💊 Đau đầu: Bạn có thể dùng Panadol (xanh/đỏ) hoặc Efferalgan 500mg. Nên nghỉ ngơi nơi yên tĩnh, uống nhiều nước.";
    if (msg.includes("sốt") || msg.includes("nóng"))
      return "🌡️ Hạ sốt: Dùng Paracetamol 500mg (cách nhau 4-6h). Chườm ấm, uống Oresol bù nước. Nếu sốt cao > 39 độ hãy đi khám.";
    if (msg.includes("đau bụng kinh") || msg.includes("tới tháng"))
      return "💊 Bạn có thể dùng Cataflam hoặc Dolfenal để giảm đau. Chườm ấm bụng và uống nước ấm sẽ dễ chịu hơn.";

    // - Tiêu hóa
    if (
      msg.includes("đau bụng") ||
      msg.includes("bao tử") ||
      msg.includes("dạ dày")
    )
      return "💊 Đau dạ dày: Dùng thuốc chữ Y (Yumangel) hoặc Gaviscon. Nên ăn đúng giờ, tránh đồ chua cay, thức khuya.";
    if (
      msg.includes("tiêu chảy") ||
      msg.includes("đi ngoài") ||
      msg.includes("tào tháo")
    )
      return "💊 Tiêu chảy: Quan trọng nhất là bù nước (Oresol). Có thể dùng Smecta hoặc Loperamid để cầm. Ăn cháo loãng, tránh sữa.";
    if (msg.includes("táo bón") || msg.includes("khó đi"))
      return "🥦 Táo bón: Cần ăn nhiều rau xanh, uống nhiều nước. Có thể dùng Duphalac hoặc Sorbitol để hỗ trợ.";
    if (msg.includes("đầy hơi") || msg.includes("khó tiêu"))
      return "💊 Đầy hơi: Bạn có thể dùng Air-X hoặc Men tiêu hóa (Bio-acimin, Enterogermina).";

    // - Hô hấp
    if (
      msg.includes("ho") ||
      msg.includes("đau họng") ||
      msg.includes("rát họng")
    )
      return "💊 Trị ho: Có Siro Prospan, Bảo Thanh, bổ phế Nam Hà. Ngậm kẹo Strepsils hoặc súc miệng nước muối ấm sáng tối.";
    if (
      msg.includes("sổ mũi") ||
      msg.includes("nghẹt mũi") ||
      msg.includes("chảy mũi")
    )
      return "💧 Sổ mũi: Rửa mũi bằng nước muối sinh lý 0.9%. Dùng thuốc xịt Otrivin hoặc Coldi-B (lưu ý không dùng quá 7 ngày).";
    if (msg.includes("cảm cúm") || msg.includes("hắt hơi"))
      return "💊 Cảm cúm: Bạn có thể dùng Decolgen, Tiffy hoặc Panadol Cảm cúm. Nhớ giữ ấm và ăn uống đầy đủ vitamin C.";

    // - Da liễu/Dị ứng
    if (
      msg.includes("dị ứng") ||
      msg.includes("ngứa") ||
      msg.includes("mề đay")
    )
      return "💊 Dị ứng: Dùng thuốc kháng Histamin như Loratadin, Cetirizin hoặc Fexofenadine. Tránh gãi gây trầy xước.";
    if (msg.includes("bỏng") || msg.includes("phỏng"))
      return "🩹 Bỏng: Xả nước mát ngay lập tức (15-20p). Bôi Panthenol hoặc mỡ trăn. Tuyệt đối không bôi kem đánh răng hay nước mắm.";
    if (msg.includes("nhiệt miệng") || msg.includes("lở miệng"))
      return "💊 Nhiệt miệng: Bôi Oracortia hoặc Urgo Mouth Ulcers. Uống thêm Vitamin C, PP, ăn đồ mát như bột sắn dây.";
    if (msg.includes("côn trùng") || msg.includes("muỗi"))
      return "💊 Côn trùng cắn: Bôi Remos IB hoặc dầu Khuynh diệp. Tránh gãi để không bị nhiễm trùng.";

    // - Khác
    if (msg.includes("mất ngủ") || msg.includes("khó ngủ"))
      return "😴 Mất ngủ: Thử trà tâm sen, Rotunda (củ bình vôi) hoặc Melatonin. Hạn chế điện thoại trước khi ngủ 1h.";
    if (
      msg.includes("xương khớp") ||
      msg.includes("đau lưng") ||
      msg.includes("mỏi gối")
    )
      return "🦴 Xương khớp: Bổ sung Glucosamine, Canxi+D3. Dùng dầu nóng xoa bóp hoặc miếng dán Salonpas giảm đau.";
    if (msg.includes("say xe") || msg.includes("tàu xe"))
      return "💊 Say xe: Uống thuốc say xe (Ariel, Nautamine) trước khi lên xe 30 phút. Có thể dùng miếng dán sau tai.";
    if (msg.includes("thuốc tránh thai") || msg.includes("ngừa thai"))
      return "💊 Chúng tôi có thuốc tránh thai hàng ngày (Marvelon, Rigevidon...) và khẩn cấp (Mifestad, Postinor). Bạn cần loại nào?";

    // 6. SẢN PHẨM CỤ THỂ (Product related)
    if (msg.includes("khẩu trang"))
      return "😷 Khẩu trang: Có loại y tế 3-4 lớp, N95 và KF94. Hộp 50 cái giá ưu đãi, kháng khuẩn tốt.";
    if (
      msg.includes("cồn") ||
      msg.includes("sát khuẩn") ||
      msg.includes("oxy già")
    )
      return "🩹 Sát khuẩn: Có cồn 70/90 độ, Oxy già, Povidine (thuốc đỏ). Dùng để rửa vết thương hoặc sát khuẩn tay.";
    if (msg.includes("bông") || msg.includes("băng") || msg.includes("gạc"))
      return "🩹 Vật tư: Bông gòn, băng cá nhân Urgo, gạc y tế tiệt trùng các kích cỡ đều có sẵn.";
    if (msg.includes("que thử") || msg.includes("thử thai"))
      return "👶 Que thử thai: Quickstick, Chip-chips... độ chính xác cao. Nên thử vào buổi sáng sớm.";
    if (msg.includes("bao cao su") || msg.includes("bcs"))
      return "💕 BCS: Durex, Sagami, OK... Đủ loại siêu mỏng, kéo dài thời gian. Đóng gói kín đáo.";
    if (msg.includes("kit test") || msg.includes("covid"))
      return "🦠 Kit test: Bên mình có bán Kit test nhanh Covid và Cúm A/B. Độ chính xác cao, dễ sử dụng tại nhà.";
    if (msg.includes("nước muối"))
      return "💧 Nước muối sinh lý 0.9%: Chai 500ml súc miệng/rửa vết thương, hoặc lọ nhỏ mắt/mũi.";

    // 7. MỸ PHẨM & LÀM ĐẸP
    if (msg.includes("mụn") || msg.includes("skincare"))
      return "🧴 Trị mụn: Sữa rửa mặt Cetaphil/Cerave + Gel chấm mụn Klenzit C/Decumar/Derma Forte. Nhớ dùng kem chống nắng!";
    if (msg.includes("sữa rửa mặt"))
      return "🧴 Sữa rửa mặt: Có Cetaphil (dịu nhẹ), Cerave (da dầu/khô), La Roche-Posay (da mụn), Simple...";
    if (msg.includes("kem chống nắng") || msg.includes("kcn"))
      return "☀️ Kem chống nắng: Có Anessa, Skin1004, La Roche-Posay. Bạn nên bôi trước khi ra nắng 20p.";
    if (msg.includes("trắng da") || msg.includes("sáng da"))
      return "✨ Trắng da: Có thể uống Vitamin C, L-Cystine, Glutathione hoặc Collagen. Kết hợp tẩy tế bào chết body.";
    if (msg.includes("rụng tóc") || msg.includes("mọc tóc"))
      return "💇‍♀️ Tóc: Dùng Biotin, Kẽm hoặc xịt tinh dầu bưởi. Dầu gội dược liệu Nguyên Xuân cũng rất tốt.";

    // 8. THỰC PHẨM CHỨC NĂNG
    if (msg.includes("vitamin") || msg.includes("bổ sung"))
      return "💊 Vitamin: Có Vitamin C (tăng đề kháng), D3K2 (xương), Kẽm (Zinc), Vitamin tổng hợp (Multivitamin) của Úc/Mỹ.";
    if (msg.includes("tăng cân") || msg.includes("gầy"))
      return "💪 Tăng cân: Uống sữa Ensure Gold, ăn đủ bữa. Có thể dùng thêm Vitamin tổng hợp hoặc viên ăn ngon.";
    if (msg.includes("giảm cân") || msg.includes("béo"))
      return "⚖️ Giảm cân: Hạn chế tinh bột/đường, tập thể dục. Dùng trà giảm cân thảo mộc hoặc viên uống L-Carnitine.";
    if (msg.includes("bổ não") || msg.includes("trí nhớ"))
      return "🧠 Bổ não: Dùng Ginkgo Biloba (hoạt huyết dưỡng não) hoặc Omega-3 giúp tăng cường trí nhớ và sự tập trung.";
    if (msg.includes("bổ mắt") || msg.includes("mỏi mắt"))
      return "👁️ Bổ mắt: Dùng Dầu cá (Omega-3), Vitamin A hoặc thuốc nhỏ mắt V.Rohto Vitamin.";
    if (msg.includes("gan") || msg.includes("giải rượu"))
      return "🍺 Gan: Boganic, Tonka bổ gan. Giải rượu có nước giải rượu Condition hoặc Alcofree.";

    // 9. MẸ VÀ BÉ
    if (msg.includes("bé") || msg.includes("trẻ em"))
      return "👶 Mẹ & Bé: Có sữa, tã bỉm, siro ho, hạ sốt, men vi sinh cho bé. Bạn cần tìm loại nào?";
    if (msg.includes("sốt ở trẻ") || msg.includes("bé sốt"))
      return "🌡️ Bé sốt: Dùng Hapacol 150/250mg (gói sủi) tùy cân nặng. Lau mát tích cực. Nếu sốt cao khó hạ phải đi viện ngay.";
    if (msg.includes("sữa") || msg.includes("tã"))
      return "🍼 Sữa/Tã: Có Meiji, Nan, Pediasure. Tã Bobby, Huggies, Merries đủ size.";

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
