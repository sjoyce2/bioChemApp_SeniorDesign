# Generated by Django 2.1.3 on 2019-03-24 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testApp', '0018_auto_20190324_1825'),
    ]

    operations = [
        migrations.AddField(
            model_name='module',
            name='deltaG',
            field=models.FloatField(default=-1.0),
        ),
        migrations.AddField(
            model_name='module',
            name='deltaGNaughtPrime',
            field=models.FloatField(default=1.0),
        ),
    ]
