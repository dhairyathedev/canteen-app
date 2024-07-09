const SUPABASE_URL = 'https://zcudmgdozarzifhfehbh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdWRtZ2RvemFyemlmaGZlaGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNDQ3NTksImV4cCI6MjAzNDgyMDc1OX0._Ec6TLx2_5bNfT-uq8tbwgUkPmJtv8aqTZmfHDUdvFM';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let cart = [];
let user = null;

async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        alert(error.message);
    } else {
        alert('Sign up successful, please check your email to verify your account.');
    }
}

async function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
        alert(error.message);
    } else {
        alert('Sign in successful.');
        document.getElementById('auth').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
        document.getElementById('cart').style.display = 'block';
        currentUser = user;
    }
}

function addToCart(name, price) {
    const item = { name, price };
    cart.push(item);
    displayCart();
}

function displayCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.textContent = `${item.name} - $${item.price}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(index);
        div.appendChild(removeButton);
        cartItemsDiv.appendChild(div);
    });
    calculateTotal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
}

function calculateTotal() {
    const totalDiv = document.getElementById('total');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalDiv.textContent = `Total: $${total}`;
}

async function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        for (const item of cart) {
            const { data, error } = await supabase
                .from('orders')
                .insert([{ item_name: item.name, price: item.price, user_id: currentUser.id }]);
            if (error) {
                alert('Error placing order: ' + error.message);
                return;
            }
        }
        alert(`Your order has been placed! Total: $${cart.reduce((sum, item) => sum + item.price, 0)}`);
        cart = [];
        displayCart();
    }
}