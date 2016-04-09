# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('building', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='days',
        ),
        migrations.RemoveField(
            model_name='room',
            name='hours',
        ),
    ]
