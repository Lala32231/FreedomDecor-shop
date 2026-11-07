from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('dream', 'Ловці снів'),
        ('sun', 'Ловці сонця'),
        ('jewelry', 'Прикраси'),
    ]

    name = models.CharField('Назва', max_length=120)
    category = models.CharField('Категорія', max_length=20, choices=CATEGORY_CHOICES)
    is_tree = models.BooleanField(
        'Дерево життя', default=False,
        help_text='Поставте галочку, якщо це «Дерево життя» (товар з’явиться в підкатегорії)',
    )
    short_description = models.CharField(
        'Короткий опис', max_length=120, blank=True,
        help_text='Наприклад: Ловець снів, 25 см',
    )
    price = models.DecimalField('Ціна, грн', max_digits=8, decimal_places=0)
    image = models.ImageField(
        'Фото', upload_to='products/', blank=True,
        help_text='Якщо фото немає, на картці буде малюнок',
    )
    is_new = models.BooleanField('Новинка (показати на головній)', default=False)
    is_available = models.BooleanField('Є в наявності', default=True)
    created = models.DateTimeField('Додано', auto_now_add=True)

    class Meta:
        ordering = ['-created']
        verbose_name = 'Товар'
        verbose_name_plural = 'Товари'

    def __str__(self):
        return self.name

    @property
    def symbol(self):
        """Який малюнок показати, поки немає фото."""
        if self.is_tree:
            return 'tree'
        return {'dream': 'dream', 'sun': 'sun', 'jewelry': 'jewel'}[self.category]
