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

window.onload = loadCart;

function addToCart(name, price, image) {
  let existingProduct = cart.find(item => item.name === name);
  
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  saveCart();
  updateCart();
  showToast("Prodotto aggiunto al carrello");
}

function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 1800);
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCart() {
  let count = document.getElementById("count");
  let total = document.getElementById("total");
  let cartList = document.getElementById("cartList");
  
  if (count) count.innerText = getCount();
  if (total) total.innerText = getTotal();
  
  if (cartList) {
    cartList.innerHTML = "";
    
    if (cart.length === 0) {
      cartList.innerHTML = "<p class='empty-cart'>Il carrello è vuoto</p>";
      return;
    }
    
    cart.forEach((item, index) => {
      cartList.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" class="cart-img" alt="${item.name}">

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

function goToCheckout() {
  if (cart.length === 0) {
    alert("Il carrello è vuoto");
    return;
  }
  
  window.location.href = "checkout.html";
}

function completeOrder(event) {
  event.preventDefault();
  
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let city = document.getElementById("city").value.trim();
  let address = document.getElementById("address").value.trim();
  let payment = document.getElementById("payment").value;
  let cardNumber = document.getElementById("cardNumber").value.trim();
  let expiry = document.getElementById("expiry").value.trim();
  let cvv = document.getElementById("cvv").value.trim();
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
  
  if (payment === "Carta") {
    if (cardNumber.replaceAll(" ", "").length !== 16) {
      error.innerText = "Numero carta non valido.";
      return;
    }
    
    if (!expiry.includes("/") || expiry.length !== 5) {
      error.innerText = "Scadenza non valida. Usa MM/AA.";
      return;
    }
    
    if (cvv.length !== 3) {
      error.innerText = "CVV non valido.";
      return;
    }
  }
  
  alert("Ordine confermato! Grazie per l'acquisto.");
  
  cart = [];
  saveCart();
  
  window.location.href = "index.html";
}