# Generated by Django 4.1.2 on 2022-11-19 17:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_src.apps.vehicle.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('finance', '0001_initial'),
        ('country', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contact_days', models.JSONField(help_text='JSON Array of contact days, ex: ["monday", "tuesday"]', verbose_name='Contact days')),
                ('contact_hour_from', models.TimeField(verbose_name='Contact hour from')),
                ('contact_hour_to', models.TimeField(verbose_name='Contact hour to')),
                ('year', models.DateField(verbose_name='Vehicle Year')),
                ('contract_type', models.CharField(choices=[('RENTAL', 'Rental'), ('SALE', 'Sale'), ('RENTAL_SALE', 'Rental and Sale')], max_length=11)),
                ('status', models.CharField(choices=[('NEW', 'New'), ('USED', 'Used')], max_length=4)),
                ('details', models.TextField(blank=True, verbose_name='Details')),
                ('accessories', models.TextField(blank=True, verbose_name='Accessories ')),
                ('services', models.TextField(blank=True, verbose_name='Services to date')),
                ('location_zone', models.TextField(blank=True, verbose_name='Location Zone')),
                ('exact_location', models.TextField(blank=True, verbose_name='Exact location')),
                ('rental_price', models.FloatField(blank=True, null=True, verbose_name='Rental price of the vehicle')),
                ('sale_price', models.FloatField(blank=True, null=True, verbose_name='Sale price of the vehicle')),
                ('contact_first_name', models.CharField(blank=True, max_length=255, verbose_name='Contact First Name')),
                ('contact_last_name', models.CharField(blank=True, max_length=255, verbose_name='Contact Last Name')),
                ('contact_email', models.EmailField(blank=True, max_length=254, verbose_name='Contact Email')),
            ],
        ),
        migrations.CreateModel(
            name='VehicleBrand',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Brand name')),
            ],
        ),
        migrations.CreateModel(
            name='VehicleVideos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video', models.FileField(upload_to=django_src.apps.vehicle.models.videos_path)),
                ('vehicle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='videos', to='vehicle.vehicle', verbose_name='Vehicle')),
            ],
        ),
        migrations.CreateModel(
            name='VehicleModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Model name')),
                ('brand', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='models', to='vehicle.vehiclebrand', verbose_name='Vehicle Brand')),
            ],
        ),
        migrations.CreateModel(
            name='VehicleImages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=django_src.apps.vehicle.models.images_path)),
                ('vehicle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='vehicle.vehicle', verbose_name='Vehicle')),
            ],
        ),
        migrations.AddField(
            model_name='vehicle',
            name='brand',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vehicles', to='vehicle.vehiclebrand', verbose_name='Vehicle Brand'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='currency',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='finance.currency', verbose_name='Currency for prices'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='location_city',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='vehicles', to='country.city', verbose_name='Location City'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vehicles', to='vehicle.vehiclemodel', verbose_name='Vehicle Model'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vehicles', to=settings.AUTH_USER_MODEL, verbose_name='Vehicle owner'),
        ),
    ]
