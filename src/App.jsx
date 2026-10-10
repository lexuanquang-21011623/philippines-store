import { useMemo, useState } from "react";
import "./App.css";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyx-1_t7QMe74hTS6XrbVqNbIE2kDLFx34jvjVBWKec4xzZoM-DLggXthJS-jCjVb6FgA/exec";

const categories = [
    { name: "Đồ ăn vặt", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=85" },
    { name: "Đồ uống", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=85" },
    { name: "Đồ gia dụng", image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=300&q=85" },
    { name: "Công nghệ", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=85" },
    { name: "Thời trang", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=85" },
    { name: "Phụ kiện", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=85" },
];

const products = [
    {
        id: 1,
        name: "Nồi chiên không dầu Philips",
        category: "Đồ gia dụng",
        price: 2990,
        oldPrice: 4990,
        rating: 4.9,
        reviews: 820,
        badge: "Bán chạy",
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=85",
    },
    {
        id: 2,
        name: "Cà phê hòa tan Nescafé",
        category: "Đồ uống",
        price: 85,
        oldPrice: 120,
        rating: 4.7,
        reviews: 318,
        badge: "Giảm giá",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=85",
    },
    {
        id: 3,
        name: "Bánh snack Piattos",
        category: "Đồ ăn vặt",
        price: 60,
        oldPrice: 66,
        rating: 4.6,
        reviews: 176,
        badge: "Bán chạy",
        image: "https://images.unsplash.com/photo-1621939514649-280e2aa2f926?auto=format&fit=crop&w=800&q=85",
    },
    {
        id: 4,
        name: "Tai nghe không dây",
        category: "Công nghệ",
        price: 499,
        oldPrice: 699,
        rating: 4.9,
        reviews: 412,
        badge: "Mới",
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=85",
    },
    {
        id: 5,
        name: "Bộ nồi nhà bếp cao cấp",
        category: "Đồ gia dụng",
        price: 1290,
        oldPrice: 1590,
        rating: 4.8,
        reviews: 205,
        badge: "Ưu đãi",
        image: "https://images.unsplash.com/photo-1584990347449-a9d8f9f6f7e0?auto=format&fit=crop&w=800&q=85",
    },
    {
        id: 6,
        name: "Balo tiện dụng hằng ngày",
        category: "Phụ kiện",
        price: 390,
        oldPrice: 490,
        rating: 4.7,
        reviews: 126,
        badge: "Nổi bật",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
    },
    {
        id: 7,
        name: "Áo sơ mi thanh lịch",
        category: "Thời trang",
        price: 450,
        oldPrice: 590,
        rating: 4.8,
        reviews: 98,
        badge: "Mới",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85",
    },
    {
        id: 8,
        name: "Cà phê rang xay nguyên chất",
        category: "Đồ uống",
        price: 150,
        oldPrice: 190,
        rating: 4.8,
        reviews: 234,
        badge: "Bán chạy",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=85",
    },
];

const money = (value) =>
    new Intl.NumberFormat("vi-VN").format(value) + " ₱";

function App() {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("Tất cả");
    const [showCart, setShowCart] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [notice, setNotice] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const [form, setForm] = useState({
        hoTen: "",
        soDienThoai: "",
        diaChi: "",
        ghiChu: "",
    });

    const filteredProducts = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchCategory =
                activeCategory === "Tất cả" ||
                product.category === activeCategory;

            const matchSearch =
                !keyword ||
                product.name.toLowerCase().includes(keyword) ||
                product.category.toLowerCase().includes(keyword);

            return matchCategory && matchSearch;
        });
    }, [search, activeCategory]);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    function notify(message) {
        setNotice(message);
        window.clearTimeout(notify.timer);
        notify.timer = window.setTimeout(() => setNotice(""), 3000);
    }

    function addToCart(product) {
        setCart((current) => {
            const found = current.find((item) => item.id === product.id);

            if (found) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...current, { ...product, quantity: 1 }];
        });

        notify("Đã thêm sản phẩm vào giỏ hàng");
    }

    function changeQuantity(id, amount) {
        setCart((current) =>
            current
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + amount }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function toggleFavorite(id) {
        setFavorites((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    }

    async function submitOrder(event) {
        event.preventDefault();

        if (!cart.length) {
            notify("Giỏ hàng của bạn đang trống");
            return;
        }

        if (
            !form.hoTen.trim() ||
            !form.soDienThoai.trim() ||
            !form.diaChi.trim()
        ) {
            notify("Vui lòng nhập đầy đủ thông tin nhận hàng");
            return;
        }

        if (
            !GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/macros/s/") ||
            GOOGLE_SCRIPT_URL.includes("DAN_LINK")
        ) {
            notify("Chưa gắn đường dẫn Google Sheets");
            return;
        }

        const order = {
            hoTen: form.hoTen.trim(),
            soDienThoai: form.soDienThoai.trim(),
            diaChi: form.diaChi.trim(),
            sanPham: cart
                .map((item) => `${item.name} x${item.quantity}`)
                .join(", "),
            soLuong: cartCount,
            tongTien: total,
            ghiChu: form.ghiChu.trim(),
            ngayDat: new Date().toISOString(),
        };

        setSubmitting(true);

        try {
            // Gửi dạng văn bản để tránh yêu cầu kiểm tra CORS trước khi gửi.
            // no-cors không cho phép trình duyệt đọc phản hồi từ Google.
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
                body: JSON.stringify(order),
            });

            // Lưu ý: trình duyệt không xác nhận được Google Sheets đã ghi dòng.
            // Chỉ thông báo đã gửi yêu cầu, không khẳng định chắc chắn đã lưu.
            notify("Đã gửi yêu cầu đặt hàng. Vui lòng kiểm tra lại đơn hàng.");
            setShowCheckout(false);
            setShowCart(false);
            setCart([]);
            setForm({
                hoTen: "",
                soDienThoai: "",
                diaChi: "",
                ghiChu: "",
            });
        } catch (error) {
            console.error("Lỗi gửi đơn hàng:", error);
            notify("Không gửi được yêu cầu. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    }

    function selectCategory(category) {
        setActiveCategory(category);
        document.getElementById("san-pham")?.scrollIntoView({
            behavior: "smooth",
        });
    }

    return (
        <div className="app-shell">
            <div className="top-strip">
                <div className="container top-strip-inner">
                    <span>🚚 Miễn phí vận chuyển cho đơn hàng từ 500.000₱</span>
                    <span>♢ Sản phẩm chính hãng 100%</span>
                    <span>☎ Hỗ trợ đổi trả trong 7 ngày</span>
                </div>
            </div>

            <header className="site-header">
                <div className="container header-inner">
                    <a className="brand" href="#trang-chu" aria-label="HomeEase - Trang chủ">
                        <span className="brand-mark">⌂</span>
                        <span className="brand-copy">
              <strong>HomeEase</strong>
              <small>Cuộc sống dễ dàng hơn</small>
            </span>
                    </a>

                    <nav className="main-nav">
                        <a className="active" href="#trang-chu">Trang chủ</a>
                        <a href="#danh-muc">Danh mục</a>
                        <a href="#san-pham">Sản phẩm</a>
                        <a href="#lien-he">Liên hệ</a>
                    </nav>

                    <label className="search-box">
                        <span>⌕</span>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Tìm sản phẩm, danh mục..."
                        />
                        {search && (
                            <button
                                type="button"
                                className="clear-search"
                                onClick={() => setSearch("")}
                                aria-label="Xóa tìm kiếm"
                            >
                                ×
                            </button>
                        )}
                    </label>

                    <button className="header-cart" onClick={() => setShowCart(true)}>
                        <span className="cart-icon">🛒</span>
                        <span>Giỏ hàng</span>
                        <b>{cartCount}</b>
                    </button>
                </div>
            </header>

            <main>
                <section className="hero container" id="trang-chu">
                    <div className="hero-copy">
                        <span className="eyebrow">✦ MUA SẮM THÔNG MINH, SỐNG TIỆN NGHI</span>
                        <h1>Sản phẩm tốt,<br />cuộc sống tốt hơn.</h1>
                        <p>
                            HomeEase mang đến những sản phẩm chất lượng, tiện nghi và hữu ích,
                            giúp bạn dễ dàng hơn trong cuộc sống hằng ngày.
                        </p>
                        <button
                            className="button button-primary hero-button"
                            onClick={() => selectCategory("Tất cả")}
                        >
                            Khám phá ngay <span>→</span>
                        </button>

                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-icon">♟</span>
                                <span><strong>2.500+</strong><small>Khách hàng đã mua</small></span>
                            </div>
                            <div className="stat">
                                <span className="stat-icon">✓</span>
                                <span><strong>100%</strong><small>Sản phẩm chính hãng</small></span>
                            </div>
                            <div className="stat">
                                <span className="stat-icon">♧</span>
                                <span><strong>Giao hàng toàn quốc</strong><small>Nhanh chóng - An toàn</small></span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <img
                            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=90"
                            alt="Không gian bếp hiện đại"
                        />
                        <div className="discount-badge">
                            <small>Giảm đến</small>
                            <strong>50%</strong>
                        </div>
                        <div className="hero-image-caption">
                            <span>Không gian sống tiện nghi</span>
                            <span>Khám phá bộ sưu tập →</span>
                        </div>
                    </div>
                </section>

                <section className="service-strip container">
                    <div className="service-item">
                        <span className="service-icon">🚚</span>
                        <span><strong>Giao hàng nhanh</strong><small>2 - 3 ngày toàn quốc</small></span>
                    </div>
                    <div className="service-item">
                        <span className="service-icon">✓</span>
                        <span><strong>Thanh toán an toàn</strong><small>Nhiều phương thức thanh toán</small></span>
                    </div>
                    <div className="service-item">
                        <span className="service-icon">♧</span>
                        <span><strong>Hỗ trợ 24/7</strong><small>Tư vấn tận tâm</small></span>
                    </div>
                    <div className="service-item">
                        <span className="service-icon">▣</span>
                        <span><strong>Đổi trả dễ dàng</strong><small>Trong 7 ngày nếu có lỗi</small></span>
                    </div>
                </section>

                <section className="section container" id="danh-muc">
                    <div className="section-heading">
                        <div>
                            <span className="section-kicker">DANH MỤC NỔI BẬT</span>
                            <h2>Khám phá danh mục sản phẩm</h2>
                            <p>Từ đồ gia dụng, đồ ăn vặt đến thời trang, tất cả đều có tại HomeEase.</p>
                        </div>
                        <button className="text-link" onClick={() => selectCategory("Tất cả")}>
                            Xem tất cả danh mục <span>→</span>
                        </button>
                    </div>

                    <div className="category-grid">
                        {categories.map((category) => (
                            <button
                                className={`category-card ${
                                    activeCategory === category.name ? "selected" : ""
                                }`}
                                key={category.name}
                                onClick={() => selectCategory(category.name)}
                            >
                                <img src={category.image} alt={category.name} />
                                <span className="category-copy">
                  <strong>{category.name}</strong>
                  <small>Khám phá ngay <span>→</span></small>
                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="section container" id="san-pham">
                    <div className="section-heading product-heading">
                        <div>
                            <span className="section-kicker">SẢN PHẨM NỔI BẬT</span>
                            <h2>
                                {activeCategory === "Tất cả"
                                    ? "Sản phẩm nổi bật"
                                    : activeCategory}
                            </h2>
                            <p>Những sản phẩm được yêu thích tại HomeEase.</p>
                        </div>
                        <div className="product-filters">
                            <button
                                className={activeCategory === "Tất cả" ? "filter-active" : ""}
                                onClick={() => setActiveCategory("Tất cả")}
                            >
                                Tất cả
                            </button>
                            <button
                                className="text-link"
                                onClick={() => setActiveCategory("Tất cả")}
                            >
                                Xem tất cả sản phẩm →
                            </button>
                        </div>
                    </div>

                    {filteredProducts.length ? (
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <article className="product-card" key={product.id}>
                                    <div className="product-image-wrap">
                                        <img src={product.image} alt={product.name} loading="lazy" />
                                        <span className={`product-badge badge-${product.id % 3}`}>
                      {product.badge}
                    </span>
                                        <button
                                            className={`favorite-button ${
                                                favorites.includes(product.id) ? "is-favorite" : ""
                                            }`}
                                            onClick={() => toggleFavorite(product.id)}
                                            aria-label="Yêu thích sản phẩm"
                                        >
                                            {favorites.includes(product.id) ? "♥" : "♡"}
                                        </button>
                                    </div>

                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <span className="product-category">{product.category}</span>
                                        <div className="rating">
                                            <span>★</span> {product.rating}
                                            <small>({product.reviews} đánh giá)</small>
                                        </div>
                                        <div className="price-row">
                                            <strong>{money(product.price)}</strong>
                                            <del>{money(product.oldPrice)}</del>
                                        </div>
                                        <button
                                            className="button add-cart-button"
                                            onClick={() => addToCart(product)}
                                        >
                                            <span>🛒</span> Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-products">
                            <span>⌕</span>
                            <h3>Chưa tìm thấy sản phẩm phù hợp</h3>
                            <p>Thử từ khóa khác hoặc xem toàn bộ sản phẩm.</p>
                            <button
                                className="button button-primary"
                                onClick={() => {
                                    setSearch("");
                                    setActiveCategory("Tất cả");
                                }}
                            >
                                Xem tất cả sản phẩm
                            </button>
                        </div>
                    )}
                </section>

                <section className="lifestyle-banner container">
                    <div className="lifestyle-image">
                        <img
                            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
                            alt="Phòng khách ấm cúng"
                            loading="lazy"
                        />
                    </div>
                    <div className="lifestyle-copy">
                        <span className="section-kicker">TRẢI NGHIỆM MUA SẮM TỐT HƠN</span>
                        <h2>Những điều nhỏ,<br />niềm vui lớn.</h2>
                        <p>
                            Chúng tôi tin rằng sản phẩm phù hợp có thể khiến cuộc sống mỗi
                            ngày trở nên dễ chịu hơn. Tìm món đồ yêu thích cùng HomeEase.
                        </p>
                        <button
                            className="button button-primary"
                            onClick={() => selectCategory("Tất cả")}
                        >
                            Tìm sản phẩm phù hợp <span>→</span>
                        </button>
                    </div>
                </section>
            </main>

            <footer className="site-footer" id="lien-he">
                <div className="container footer-grid">
                    <div className="footer-about">
                        <a className="brand footer-brand" href="#trang-chu">
                            <span className="brand-mark">⌂</span>
                            <span className="brand-copy">
                <strong>HomeEase</strong>
                <small>Cuộc sống dễ dàng hơn</small>
              </span>
                        </a>
                        <p>
                            Đồng hành cùng bạn trong việc lựa chọn những sản phẩm hữu ích,
                            chất lượng và thiết thực cho cuộc sống hằng ngày.
                        </p>
                        <small>© 2026 HomeEase. Tất cả quyền được bảo lưu.</small>
                    </div>

                    <div className="footer-column">
                        <h4>Khám phá</h4>
                        <a href="#trang-chu">Trang chủ</a>
                        <a href="#danh-muc">Danh mục sản phẩm</a>
                        <a href="#san-pham">Sản phẩm nổi bật</a>
                    </div>

                    <div className="footer-column">
                        <h4>Hỗ trợ khách hàng</h4>
                        <a href="#lien-he">Hướng dẫn mua hàng</a>
                        <a href="#lien-he">Giao hàng và thanh toán</a>
                        <a href="#lien-he">Chính sách đổi trả</a>
                    </div>

                    <div className="footer-column contact-column">
                        <h4>Liên hệ với chúng tôi</h4>
                        <p>☎ &nbsp; +63 912 345 6789</p>
                        <p>✉ &nbsp; hello@homeease.ph</p>
                        <p>⌖ &nbsp; Manila, Philippines</p>
                        <p>◷ &nbsp; Hỗ trợ mỗi ngày</p>
                    </div>
                </div>
            </footer>

            {notice && (
                <div className="toast-message" role="status">
                    <span>✓</span> {notice}
                </div>
            )}

            {showCart && (
                <div className="overlay" onMouseDown={() => setShowCart(false)}>
                    <aside className="side-panel" onMouseDown={(e) => e.stopPropagation()}>
                        <div className="panel-heading">
                            <div>
                                <span className="section-kicker">HOME EASE</span>
                                <h2>Giỏ hàng của bạn</h2>
                            </div>
                            <button className="close-button" onClick={() => setShowCart(false)}>×</button>
                        </div>

                        {!cart.length ? (
                            <div className="empty-cart">
                                <span>🛒</span>
                                <h3>Giỏ hàng đang trống</h3>
                                <p>Hãy chọn những sản phẩm bạn yêu thích nhé.</p>
                                <button
                                    className="button button-primary"
                                    onClick={() => setShowCart(false)}
                                >
                                    Tiếp tục mua sắm
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map((item) => (
                                        <div className="cart-item" key={item.id}>
                                            <img src={item.image} alt={item.name} />
                                            <div className="cart-item-details">
                                                <h3>{item.name}</h3>
                                                <strong>{money(item.price)}</strong>
                                                <div className="quantity-control">
                                                    <button onClick={() => changeQuantity(item.id, -1)}>−</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                                                </div>
                                            </div>
                                            <button
                                                className="remove-item"
                                                onClick={() => changeQuantity(item.id, -item.quantity)}
                                                aria-label="Xóa sản phẩm"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-summary">
                                    <div><span>Số lượng sản phẩm</span><strong>{cartCount}</strong></div>
                                    <div className="summary-total"><span>Tổng tiền</span><strong>{money(total)}</strong></div>
                                    <button
                                        className="button button-primary checkout-button"
                                        onClick={() => {
                                            setShowCart(false);
                                            setShowCheckout(true);
                                        }}
                                    >
                                        Tiến hành đặt hàng <span>→</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </aside>
                </div>
            )}

            {showCheckout && (
                <div className="overlay" onMouseDown={() => !submitting && setShowCheckout(false)}>
                    <section className="checkout-panel" onMouseDown={(e) => e.stopPropagation()}>
                        <div className="panel-heading">
                            <div>
                                <span className="section-kicker">HOÀN TẤT ĐƠN HÀNG</span>
                                <h2>Thông tin nhận hàng</h2>
                            </div>
                            <button
                                className="close-button"
                                disabled={submitting}
                                onClick={() => setShowCheckout(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form className="checkout-form" onSubmit={submitOrder}>
                            <label>
                                Họ và tên <span>*</span>
                                <input
                                    required
                                    value={form.hoTen}
                                    onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
                                    placeholder="Nhập họ và tên người nhận"
                                />
                            </label>
                            <label>
                                Số điện thoại <span>*</span>
                                <input
                                    required
                                    type="tel"
                                    value={form.soDienThoai}
                                    onChange={(e) => setForm({ ...form, soDienThoai: e.target.value })}
                                    placeholder="Nhập số điện thoại"
                                />
                            </label>
                            <label>
                                Địa chỉ nhận hàng <span>*</span>
                                <textarea
                                    required
                                    rows="3"
                                    value={form.diaChi}
                                    onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                                    placeholder="Số nhà, đường, thành phố..."
                                />
                            </label>
                            <label>
                                Ghi chú đơn hàng
                                <textarea
                                    rows="2"
                                    value={form.ghiChu}
                                    onChange={(e) => setForm({ ...form, ghiChu: e.target.value })}
                                    placeholder="Ghi chú thêm nếu có"
                                />
                            </label>

                            <div className="checkout-total">
                                <span>Tổng thanh toán</span>
                                <strong>{money(total)}</strong>
                            </div>

                            <button
                                className="button button-primary checkout-button"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? "Đang gửi yêu cầu..." : "Xác nhận đặt hàng"}
                            </button>
                            <p className="checkout-note">
                                Đơn hàng sẽ được gửi đến hệ thống tiếp nhận để xử lý.
                            </p>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

export default App;