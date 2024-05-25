

const addToCartButton = document.querySelector(".add-to-cart");
const cart = await getCartById('664bb4faa5bc7c5f3e9173b2');
const productId = await document.querySelector('#product-id').value;
console.log(productId);
addToCartButton.addEventListener('click', async () => {
    const result = await cart.addProductToCart(cart, productId);
    console.log(result);
});