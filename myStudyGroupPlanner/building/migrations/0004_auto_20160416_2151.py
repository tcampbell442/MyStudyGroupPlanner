# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('building', '0003_auto_20160412_0057'),
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=16)),
                ('abrv', models.CharField(max_length=3)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Day',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('day', models.CharField(max_length=1, choices=[(0, b'Monday'), (1, b'Tuesday'), (2, b'Wednesday'), (3, b'Thursday'), (4, b'Friday'), (5, b'Saturday'), (6, b'Sunday')])),
                ('room', models.ForeignKey(related_name='days', to='building.Room', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Hour',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_hour', models.TimeField(default=datetime.time(0, 0), blank=True)),
                ('end_hour', models.TimeField(default=datetime.time(0, 0), blank=True)),
                ('room', models.ForeignKey(related_name='hours', to='building.Room', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='room',
            name='name',
        ),
        migrations.AddField(
            model_name='room',
            name='building',
            field=models.ForeignKey(related_name='rooms', to='building.Building', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='room',
            name='room_num',
            field=models.CharField(max_length=3, blank=True),
            preserve_default=True,
        ),
    ]
