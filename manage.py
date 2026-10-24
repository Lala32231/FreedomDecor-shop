#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "auth_demo.settings")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
#запуск так  --
# python3 manage.py runserver
# миграции --
# python3 manage.py makemigrations
# python3 manage.py migrate