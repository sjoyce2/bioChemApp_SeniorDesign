# Generated by Django 2.1.3 on 2019-01-29 01:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('testApp', '0003_auto_20190129_0056'),
    ]

    operations = [
        migrations.RenameField(
            model_name='module',
            old_name='substraight',
            new_name='substrate',
        ),
    ]
