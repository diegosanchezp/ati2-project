# Generated by Django 4.1.1 on 2022-10-23 13:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Name')),
                ('iso3', models.CharField(blank=True, max_length=3, verbose_name='iso3 abbreviation code')),
                ('numeric_code', models.CharField(blank=True, max_length=100, verbose_name='Numeric code ')),
                ('iso2', models.CharField(blank=True, max_length=2, verbose_name='iso2 abbreviation')),
                ('phonecode', models.CharField(blank=True, max_length=255, verbose_name='Phone code ')),
                ('capital', models.CharField(blank=True, max_length=255)),
                ('continent', models.CharField(blank=True, max_length=255, verbose_name='Continent')),
                ('subregion', models.CharField(blank=True, max_length=255, verbose_name='Sub region')),
            ],
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('iso2', models.CharField(blank=True, max_length=255, verbose_name='iso2 abbreviation')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='states', to='country.country', verbose_name='Country')),
            ],
        ),
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cities', to='country.state', verbose_name='City')),
            ],
        ),
    ]
