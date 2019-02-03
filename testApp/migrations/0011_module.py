# Generated by Django 2.1.3 on 2019-02-03 20:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('testApp', '0010_auto_20190131_0011'),
    ]

    operations = [
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('modelID', models.IntegerField()),
                ('moduleID', models.IntegerField()),
                ('substrate', models.CharField(max_length=200)),
                ('product', models.CharField(max_length=200)),
                ('enzyme', models.CharField(max_length=200)),
                ('reversible', models.CharField(max_length=200)),
                ('modelName', models.CharField(max_length=200)),
                ('userID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
