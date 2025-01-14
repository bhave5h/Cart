let items = [];
let cart = [];

$(document).ready(function () {
    $.getJSON('items.json', function (data) {
        items = data;
        displayItems();
        console.log(items);
    });
});


function displayItems() {
    const itemList = $('#item-list');
    items.forEach((item, i) => {
        itemList.append(`
            <tr>
                <td>${item.srno}</td>
                <td>${item.item}</td>
                <td>${item.price}&#8377;</td>
                <td><input type="number" id="qty-${i}" class="form-control" min="0" value="0"></td>
                <td><button class="btn btn-success" onclick="addToCart(${i})">Add</button></td>
            </tr>
        `);
    });
}

function addToCart(index) {
    const quantity = parseInt($(`#qty-${index}`).val());
    if (quantity <= 0) return;
    const item = items[index];
    const existingItem = cart.find(cartItem => cartItem.item === item.item);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ item: item.item, price: item.price, quantity });
    }

    updateCart();
}

function updateCart() {
    const cartTable = $('#cart');
    cartTable.empty();
    let total = 0;
    cart.forEach((item, i) => {
        const amount = item.price * item.quantity;
        total += amount;

        cartTable.append(`
            <tr>
                <td>${i + 1}</td>
                <td>${item.item}</td>
                <td>${item.price}&#8377;</td>
                <td><input type="number" id="cart-qty-${i}" class="form-control" min="0" value="${item.quantity}" onchange="changeQuantity(${i})"></td>
                <td>${amount.toFixed(2)}&#8377;</td>
                <td><button class="btn btn-danger" onclick="removeFromCart(${i})">Remove</button></td>
            </tr>
        `);
    });

    $('#total-amount').text(total.toFixed(2));
}

function changeQuantity(index) {
    const newQuantity = parseInt($(`#cart-qty-${index}`).val());
    if (newQuantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = newQuantity;
        updateCart();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}