const foods = [
  { id: 1, name: "Osh (Palov)", category: "Asosiy", price: 35000, emoji: "🍛", desc: "Toshkentcha to'y oshi" },
  { id: 2, name: "Lag'mon", category: "Asosiy", price: 30000, emoji: "🍜", desc: "Qo'lda cho'zilgan lag'mon" },
  { id: 3, name: "Manti", category: "Asosiy", price: 28000, emoji: "🥟", desc: "Bug'da pishgan go'shtli manti" },
  { id: 4, name: "Shashlik", category: "Asosiy", price: 18000, emoji: "🍢", desc: "Mol go'shtidan shashlik (1 six)" },
  { id: 5, name: "Sho'rva", category: "Sho'rva", price: 25000, emoji: "🍲", desc: "Qo'y go'shtidan sho'rva" },
  { id: 6, name: "Mastava", category: "Sho'rva", price: 22000, emoji: "🥣", desc: "Guruchli mastava" },
  { id: 7, name: "Somsa", category: "Pishiriq", price: 8000, emoji: "🥐", desc: "Tandir somsa" },
  { id: 8, name: "Non", category: "Pishiriq", price: 4000, emoji: "🫓", desc: "Issiq tandir non" },
  { id: 9, name: "Achchiq-chuchuk", category: "Salat", price: 12000, emoji: "🥗", desc: "Pomidor va piyozli salat" },
  { id: 10, name: "Ko'k choy", category: "Ichimlik", price: 5000, emoji: "🍵", desc: "Choynakda ko'k choy" },
  { id: 11, name: "Kompot", category: "Ichimlik", price: 7000, emoji: "🧃", desc: "Uy kompoti" },
];

let cart = JSON.parse(localStorage.getItem("cart") || "{}");
let activeCategory = "Barchasi";

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString("uz-UZ").replace(/,/g, " ");

function renderCategories() {
  const cats = ["Barchasi", ...new Set(foods.map((f) => f.category))];
  $("categories").innerHTML = cats
    .map((c) => `<button class="${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

function renderMenu() {
  const q = $("search").value.toLowerCase();
  const list = foods.filter(
    (f) => (activeCategory === "Barchasi" || f.category === activeCategory) && f.name.toLowerCase().includes(q)
  );
  $("menu").innerHTML = list.length
    ? list.map((f) => `
      <div class="card">
        <div class="emoji">${f.emoji}</div>
        <h3>${f.name}</h3>
        <p>${f.desc}</p>
        <div class="price">${fmt(f.price)} so'm</div>
        <button data-add="${f.id}">Savatga qo'shish</button>
      </div>`).join("")
    : "<p>Hech narsa topilmadi.</p>";
}

function renderCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  const ids = Object.keys(cart);
  let total = 0, count = 0;
  $("cartItems").innerHTML = ids.length
    ? ids.map((id) => {
        const f = foods.find((x) => x.id == id);
        const qty = cart[id];
        total += f.price * qty; count += qty;
        return `<li><span>${f.emoji} ${f.name}</span>
          <span><button data-dec="${id}">−</button>${qty}<button data-inc="${id}">+</button></span>
          <span>${fmt(f.price * qty)}</span></li>`;
      }).join("")
    : "<li>Savat bo'sh</li>";
  $("cartTotal").textContent = fmt(total);
  $("cartCount").textContent = count;
}

document.addEventListener("click", (e) => {
  const t = e.target.dataset;
  if (t.cat) { activeCategory = t.cat; renderCategories(); renderMenu(); }
  if (t.add) { cart[t.add] = (cart[t.add] || 0) + 1; renderCart(); }
  if (t.inc) { cart[t.inc]++; renderCart(); }
  if (t.dec) { if (--cart[t.dec] <= 0) delete cart[t.dec]; renderCart(); }
});

$("search").addEventListener("input", renderMenu);
$("cartBtn").onclick = () => $("cart").classList.remove("hidden");
$("closeCart").onclick = () => $("cart").classList.add("hidden");

$("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!Object.keys(cart).length) return alert("Savat bo'sh!");
  alert(`Rahmat, ${$("name").value}! Buyurtmangiz qabul qilindi.\nJami: ${$("cartTotal").textContent} so'm`);
  cart = {};
  e.target.reset();
  renderCart();
  $("cart").classList.add("hidden");
});

renderCategories();
renderMenu();
renderCart();