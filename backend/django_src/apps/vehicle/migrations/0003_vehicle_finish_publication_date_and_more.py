# Generated by Django 4.1.2 on 2022-11-28 15:09

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicle', '0002_vehicle_type_vehicle'),
    ]

    operations = [
        migrations.AddField(
            model_name='vehicle',
            name='finish_publication_date',
            field=models.DateField(default=datetime.date.today, verbose_name='Finish publication date'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='init_publication_date',
            field=models.DateField(default=datetime.date.today, verbose_name='Init publication date'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='publication_enabled',
            field=models.BooleanField(default=True, verbose_name='Publication enabled'),
        ),
    ]
