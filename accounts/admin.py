from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_tree', 'price', 'is_new', 'is_available')
    list_editable = ('price', 'is_new', 'is_available')
    list_filter = ('category', 'is_tree', 'is_new', 'is_available')
    search_fields = ('name', 'short_description')