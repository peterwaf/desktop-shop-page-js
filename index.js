// products
let productItems = [
  {
    id: "dhfhriosjddf",
    image: "./images/Blush_Cover-475x578.jpg",
    title: "Brush Pen",
    amount: 500,
    quantity: 1,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit numquam."
  }, {
    id: "jhdhhwiiwwwr",
    image: "./images/Cover-5-475x578.jpg",
    title: "Cover Bag",
    amount: 900,
    quantity: 1,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit numquam."
  },
  {
    id: "hdgdggeiese",
    image: "./images/cover_eyeshadow-475x578.jpg",
    title: "Eye Shadow",
    amount: 200,
    quantity: 1,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit numquam."
  },
  {
    id: "hdggegeheu",
    image: "./images/Cover-13-475x578.jpg",
    title: "Costa Inged",
    amount: 354,
    quantity: 1,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit numquam."
  },
  {
    id: "ddggfefeet",
    image: "./images/Cover-6-475x578.jpg",
    title: "Indian Cover",
    amount: 524,
    quantity: 1,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit numquam."
  },
  {
    id: "jdhegefef",
    image: "./images/cover-2-475x578.jpg",
    title: "Himalayas Ingredient",
    amount: 478,
    quantity: 1,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit numquam."
  },
  {
    id: "jdhegegeu",
    image: "./images/Cover-7-475x578.jpg",
    title: "Chania Ingred",
    amount: 458,
    quantity: 1,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit numquam."
  }
]

// Defining Variables
const openShoppingCart = document.querySelector(".shopping");
const closeShoppingCart = document.querySelector(".closeShopping");
const body = document.querySelector("body");
const quantity = document.querySelector(".quantity");
const list = document.querySelector(".list");
const listCart = document.querySelector(".listCart");
const total = document.querySelector(".total");
const addCart = document.getElementsByClassName("addCart");

// display products

function displayProducts() {
  for (let i = 0; i < productItems.length; i++) {
    const oneProductItem = productItems[i];
    list.innerHTML += `<div class="productItem">
                      <img src=${oneProductItem.image} alt="">
                      <p class="prod-title">${oneProductItem.title}</p>
                      <p class="prod-price">KES ${oneProductItem.amount}</p>
                      <button class="addCart" id=${oneProductItem.id}>Add to Cart</button>
                      </div>`

  }
}

displayProducts();

// showing and hiding the cart
openShoppingCart.addEventListener("click", () => {
  body.classList.add("active");
});

closeShoppingCart.addEventListener("click", () => {
  body.classList.remove("active");
})

function addToCart() {
  //listen for the click event in each button
  for (let i = 0; i < addCart.length; i++) {
    const button = addCart[i];
    button.addEventListener("click", function () {
      //loop through the existing products data
      for (let i = 0; i < productItems.length; i++) {
        const productItem = productItems[i];
        if (productItem.id == this.id) {
          //add the product item to localStorage
          localStorage.setItem(`cartItem-${productItem.id}`, JSON.stringify(productItem));
        }
      }
      //update the quantity
      loadCartProductsQty();
      hideAddedProductsButtons();
      setTimeout(() => { location.reload() }, 100)
    })
  }
}

function displayCartItems() {
  let addedProductsForCartDisplay = localStorageCartProducts();
  for (let i = 0; i < addedProductsForCartDisplay.length; i++) {
    let productCartItemObject = addedProductsForCartDisplay[i];
    listCart.innerHTML += `
    <li id="${productCartItemObject.id}">
        <table>
        <tr>
        <td><img src="${productCartItemObject.image}" class="cart-img" alt=""></td>
        <td>${productCartItemObject.title}</td>
        <td>KES ${productCartItemObject.amount}</td>
        <td><b>Qty</b></td>
        <td><button type="button" class="qty-remove" data-remove-qty="${productCartItemObject.id}">-</button>
        <input class="product-qty" data-set-qty="${productCartItemObject.id}" name="product-qty" value="${productCartItemObject.quantity}" />
        <button type="button" data-add-qty="${productCartItemObject.id}" class="qty-add">+</button></td>
        </tr>
        </table>
  </li>`;
  }
  // refresh totals
  totalsRefresh();
}

function hideAddedProductsButtons() {
  for (let i = 0; i < addCart.length; i++) {
    const addProductButton = addCart[i];
    let addedProducts = localStorageCartProducts();
    for (let i = 0; i < addedProducts.length; i++) {
      const addedProduct = addedProducts[i];
      if (addProductButton.id == addedProduct.id) {
        addProductButton.innerText = "Added to cart";
        addProductButton.style.color = "red";
        addProductButton.disabled = true;
      }
    }
  }

}

function addProductQty() {
  let addQtyBtns = document.querySelectorAll(".qty-add");
  for (let i = 0; i < addQtyBtns.length; i++) {
    const addQtyBtn = addQtyBtns[i];
    addQtyBtn.addEventListener("click", function () {
      let prodCLickedInput = document.querySelector(`input[data-set-qty="${this.getAttribute("data-add-qty")}"]`);
      let prodCLickedInputValue = parseInt(prodCLickedInput.value);
      prodCLickedInputValue++;
      prodCLickedInput.value = prodCLickedInputValue;
      prodCLickedInputValue == 0 ? prodCLickedInputValue = 1 : prodCLickedInput.value = prodCLickedInputValue;
      //loop through the localStorage prods
      for (let i = 0; i < localStorage.length; i++) {
        const storedProductKey = localStorage.key(i);
        if (storedProductKey == `cartItem-${this.getAttribute("data-add-qty")}`) {
          //find the stored clicked product in the localStorage
          const storedProductString = localStorage.getItem(storedProductKey);
          const storedProductObject = JSON.parse(storedProductString);
          // update it's quantity
          localStorage.setItem(storedProductKey, JSON.stringify(
            {
              amount: storedProductObject.amount,
              description: storedProductObject.description,
              id: storedProductObject.id,
              image: storedProductObject.image,
              quantity: prodCLickedInputValue,
              title: storedProductObject.title
            }
          ))
          //update the total
          loadCartProductsTotal();
          //update the quantity
          loadCartProductsQty();
        }
      }
    });
  }
}

function reduceProductQty() {
  let removeQtyBtns = document.querySelectorAll(".qty-remove");
  for (let i = 0; i < removeQtyBtns.length; i++) {
    const removeQtyBtn = removeQtyBtns[i];
    removeQtyBtn.addEventListener("click", function () {
      let prodCLickedInput = document.querySelector(`input[data-set-qty="${this.getAttribute("data-remove-qty")}"]`);
      let prodCLickedInputValue = parseInt(prodCLickedInput.value);
      prodCLickedInputValue--;
      prodCLickedInputValue == 0 ? prodCLickedInputValue = 1 : prodCLickedInput.value = prodCLickedInputValue;
      //loop through the localStorage prods
      for (let i = 0; i < localStorage.length; i++) {
        const storedProductKey = localStorage.key(i);
        if (storedProductKey == `cartItem-${this.getAttribute("data-remove-qty")}`) {
          //find the stored clicked product in the localStorage
          const storedProductString = localStorage.getItem(storedProductKey);
          const storedProductObject = JSON.parse(storedProductString);
          // update it's quantity
          localStorage.setItem(storedProductKey, JSON.stringify(
            {
              amount: storedProductObject.amount,
              description: storedProductObject.description,
              id: storedProductObject.id,
              image: storedProductObject.image,
              quantity: prodCLickedInputValue,
              title: storedProductObject.title
            }
          ))
          //update the total
          loadCartProductsTotal();
          //update the quantity
          loadCartProductsQty();
        }
      }

    });
  }
}

//reusable function to load all the products in local storage

function localStorageCartProducts() {
  const addedProducts = [];
  for (let i = 0; i < localStorage.length; i++) {
    const addedProduct = localStorage.key(i);
    if (addedProduct.startsWith('cartItem')) {
      const addedProductText = localStorage.getItem(addedProduct);
      const addedProductObject = JSON.parse(addedProductText);
      addedProducts.push(addedProductObject);
    }
  }
  return addedProducts;
}

function loadCartProductsTotal() {
  let qtyTotal = 0;
  let allAddedProducts = localStorageCartProducts();
  for (let i = 0; i < allAddedProducts.length; i++) {
    const addedProduct = allAddedProducts[i];
    const addedProductQty = addedProduct.quantity;
    const addedProductAmount = addedProduct.amount;
    const addedProductTotal = addedProductQty * addedProductAmount;
    qtyTotal += addedProductTotal;
  }
  total.innerText = qtyTotal;
}
function totalsRefresh() {
  const allCartButtons = document.querySelectorAll(".qty-remove,.qty-add");
  //listen to click event when any of the buttons is clicked;
  for (let i = 0; i < allCartButtons.length; i++) {
    const cartButton = allCartButtons[i];
    cartButton.addEventListener("click", function () {
      loadCartProductsTotal();
    })
  }
}

function loadCartProductsQty() {
  let productsQty = 0;
  const cartaddedProducts = localStorageCartProducts();
  cartaddedProducts.map(cartaddedProduct => {
    productsQty += cartaddedProduct.quantity;
  })
  quantity.innerText = productsQty;
}

//listen to add to cart button click event
addToCart();
//display products in the cart
displayCartItems();
//hide added products buttons
hideAddedProductsButtons();
//add product quantities
addProductQty();
//reduce product quantities
reduceProductQty();
//load CartProducts Total
loadCartProductsTotal();
loadCartProductsQty();



