from django.shortcuts import render

from .models import Product


def available():
    """Усі товари, які є в наявності."""
    return Product.objects.filter(is_available=True)


def home(request):
    products = available().filter(is_new=True)[:4]
    return render(request, 'freedomdecor/home.html', {'new_products': products})


def catalog(request, tree=False):
    products = available()
    if tree:
        products = products.filter(is_tree=True)
    return render(request, 'freedomdecor/catalog.html', {
        'products': products,
        'only_tree': tree,
    })


def category_page(request, template, category, tree):
    products = available().filter(category=category)
    if tree:
        products = products.filter(is_tree=True)
    return render(request, template, {'products': products, 'only_tree': tree})


def dream(request, tree=False):
    return category_page(request, 'freedomdecor/dream.html', 'dream', tree)


def sun(request, tree=False):
    return category_page(request, 'freedomdecor/sun.html', 'sun', tree)


def jewelry(request, tree=False):
    return category_page(request, 'freedomdecor/jewelry.html', 'jewelry', tree)
