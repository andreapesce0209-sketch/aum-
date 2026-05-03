let cart = [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  let savedCart = localStorage.getItem("cart");

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  updateCart();
}

function addToCart(name, price) {
  let existingProduct = cart.find(item => item.name === name);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  updateCart();
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCart() {
  const count = document.getElementById("count");
  const totalElement = document.getElementById("total");
  const list = document.getElementById("cartList");

  if (count) {
    count.innerText = getCount();
  }

  if (totalElement) {
    totalElement.innerText = getTotal();
  }

  if (list) {
    list.innerHTML = "";

    if (cart.length === 0) {
      list.innerHTML = "<p>Il carrello è vuoto</p>";
      return;
    }

   cart.forEach((item, index) => {
  list.innerHTML += `
    <div class="cart-item">
      <div class="cart-info">
        <h3>${item.name}</h3>
        <p>€${item.price}</p>
      </div>

      <div class="cart-actions">
        <button onclick="decreaseQuantity(${index})">−</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${index})">+</button>
      </div>

      <button class="remove" onclick="removeItem(${index})">Rimuovi</button>
    </div>
  `;
});
  }
}

function increaseQuantity(index) {
  cart[index].quantity++;
  saveCart();
  updateCart();
}

function decreaseQuantity(index) {
  cart[index].quantity--;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function goToCart() {
  saveCart();
  window.location.href = "cart.html";
}

function checkout() {
  if (cart.length === 0) {
    alert("Il carrello è vuoto");
    return;
  }

  alert("Pagamento simulato! Totale: €" + getTotal());

  cart = [];
  saveCart();
  updateCart();
}

window.onload = loadCart;

function goToCheckout() {
  if (cart.length === 0) {
    alert("Il carrello è vuoto");
    return;
  }

  saveCart();
  window.location.href = "checkout.html";
}

async function completeOrder(event) {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let city = document.getElementById("city").value.trim();
  let address = document.getElementById("address").value.trim();
  let email = document.getElementById("email").value.trim();
  let payment = document.getElementById("payment").value;
  let error = document.getElementById("error");

  error.innerText = "";

  if (name.length < 3 || !name.includes(" ")) {
    error.innerText = "Inserisci nome e cognome validi.";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    error.innerText = "Email non valida.";
    return;
  }

  if (city.length < 2) {
    error.innerText = "Città non valida.";
    return;
  }

  if (address.length < 3) {
    error.innerText = "Via non valida.";
    return;
  }

  if (payment === "") {
    error.innerText = "Seleziona un metodo di pagamento.";
    return;
  }

  error.innerText = "Controllo indirizzo in corso...";

  let isAddressValid = await checkAddress(city, address);

  if (!isAddressValid) {
    error.innerText = "La città o la via non sembrano esistere. Controlla i dati.";
    return;
  }

  alert("Ordine confermato! Grazie per l'acquisto.");

  cart = [];
  saveCart();

  window.location.href = "index.html";
}

async function checkAddress(city, address) {
  let query = encodeURIComponent(`${address}, ${city}, Italia`);
  let url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    let response = await fetch(url);
    let data = await response.json();

    return data.length > 0;
  } catch (error) {
    return false;
  }
}