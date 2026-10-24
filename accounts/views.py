from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from auth_demo.models import Product, Cart, CartItem, Order, OrderItem
from django.http import JsonResponse

# ---------- Головна ----------
def home(request):
    return render(request, 'accounts/home.html')

# ---------- Реєстрація ----------
def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})

# ---------- Вхід ----------
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})

# ---------- Вихід ----------
def logout_view(request):
    logout(request)
    return redirect('login')

# ---------- Профіль ----------
@login_required
def profile(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'accounts/profile.html', {'orders': orders})

# ---------- Корзина ----------
@login_required
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    return redirect('order') 

@login_required
def cart(request):
    cart_obj, created = Cart.objects.get_or_create(user=request.user)
    items = CartItem.objects.filter(cart=cart_obj)
    total = sum(item.total_price() for item in items)

    return render(
        request,
        'accounts/cart.html',
        {
            'cart': cart_obj,
            'items': items,
            'total': total 
        }
    )

# ---------- Меню / Замовлення ----------
def order(request):
    products = Product.objects.all()
    category_order = ['Випічка', 'Кава', 'Какао', 'Чай']
    
    categories = {}
    for product in products:
        if product.category not in categories:
            categories[product.category] = []
        categories[product.category].append(product)
    
    sorted_categories = {cat: categories[cat] for cat in category_order if cat in categories}
    
    return render(request, 'accounts/order.html', {'categories': sorted_categories})


# ---------- Додати в кошик ----------
@login_required
def checkout(request):
    if request.method == 'POST':
        cart = get_object_or_404(Cart, user=request.user)
        items = CartItem.objects.filter(cart=cart)
        if items.exists():
            order = Order.objects.create(user=request.user)
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )
            items.delete()
        return JsonResponse({'status': 'ok'})

# ---------- Видалити з кошика ----------
@login_required
def remove_from_cart(request, item_id):
    item = get_object_or_404(CartItem, id=item_id)
    item.delete()
    return redirect('cart')
