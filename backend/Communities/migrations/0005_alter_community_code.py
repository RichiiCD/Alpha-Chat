# Generated by Django 3.2.5 on 2022-01-12 18:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Communities', '0004_community'),
    ]

    operations = [
        migrations.AlterField(
            model_name='community',
            name='code',
            field=models.CharField(editable=False, max_length=20, unique=True),
        ),
    ]
