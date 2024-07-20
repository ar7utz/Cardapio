const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const endInput = document.getElementById("endereco")
const endWarn = document.getElementById("endereco-warn")

let cart = [];

cartBtn.addEventListener("click", function(){
    upCartModal();
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name,price)
    }
})

function addToCart(name, price){
    const hasItem = cart.find(item => item.name === name)

    if(hasItem){
        hasItem.quantidade +=1
    }else{
        cart.push({
            name,
            price,
            quantidade: 1,
        })
    }

    upCartModal()
}

function upCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item =>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")


        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantidade}</p>
                <p class="font-medium mt-2">${item.price.toFixed(2)}</p>     
            </div>

            <div>
                <button class="remove-cart" data-name="${item.name}">
                    Remover
                </button>
            </div>
        </div>
        `

        total += item.price * item.quantidade;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    cartCounter.innerText = cart.length;
}

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-cart")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantidade > 1){
            item.quantidade -= 1;
            upCartModal();
            return;
        }

        cart.splice(index, 1);
        upCartModal();
    }
}

endInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        endWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function(){

    const isOpen = checkOpen()
    if(!isOpen){
        
        Toastify({
            text: "O restaurante está FECHADO no momento!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            },       
        }).showToast();
    }

    if(cart.length === 0) return;
    if(endInput.value === ""){
        endWarn.classList.remove("hidden")
        return;
    }

    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantidade}) Preço: R$${item.price}`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "18996640751"

    window.open(`https://wa.me/${phone}?text= ${message} Endereco: ${endInput.value} `, "_blank")

    cart = [];
    upCartModal();
})

function checkOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}