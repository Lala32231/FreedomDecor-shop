from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from auth_demo.models import Product, CartItem, Order, OrderItem

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "description", "price", "image", "category"]
        labels = {
            "name": "Назва",
            "description": "Опис",
            "price": "Ціна",
            "image": "Картинка",
            "category": "Категорія",
        }
        widgets = {
            "name": forms.TextInput(attrs={"class": "input-field", "placeholder": "Назва"}),
            "description": forms.Textarea(attrs={"class": "input-field", "placeholder": "Опис"}),
            "price": forms.NumberInput(attrs={"class": "input-field", "placeholder": "Ціна"}),
            "category": forms.TextInput(attrs={"class": "input-field", "placeholder": "Категорія"}),
        }

class CartItemForm(forms.ModelForm):
    class Meta:
        model = CartItem
        fields = ["quantity"]

class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ["status"]
        
class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ["gender", "country", "email"]
        labels = {
            "gender": "Стать",
            "country": "Країна",
            "email": "Електронна пошта",
        }

    def clean(self):
        cleaned_data = super().clean()
        gender = cleaned_data.get("gender")
        country = cleaned_data.get("country")
        email = cleaned_data.get("email")

        if not gender:
            self.add_error("gender", "Оберіть стать.")
        if not country:
            self.add_error("country", "Введіть країну.")
        if not email:
            self.add_error("email", "Введіть електронну пошту.")

        return cleaned_data

class CustomRegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].label = 'Імʼя користувача'
        self.fields['username'].help_text = ''  
        self.fields['password1'].label = 'Пароль'
        self.fields['password1'].help_text = ''
        self.fields['password2'].label = 'Підтвердження пароля'
        self.fields['password2'].help_text = ''


class LoginForm(AuthenticationForm):
    class Meta:
        labels = {
            "username": "Ім'я користувача",
            "password": "Пароль",
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].label = "Ім'я користувача"
        self.fields['password'].label = "Пароль"