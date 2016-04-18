# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('building', '0002_auto_20160409_1553'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Day',
        ),
        migrations.DeleteModel(
            name='Hours',
        ),
    ]
