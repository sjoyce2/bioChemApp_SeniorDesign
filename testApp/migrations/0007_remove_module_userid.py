# Generated by Django 2.1.3 on 2019-01-30 23:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('testApp', '0006_auto_20190129_0111'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='module',
            name='userID',
        ),
    ]
