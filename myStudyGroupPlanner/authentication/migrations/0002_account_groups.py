# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0007_auto_20160416_2151'),
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='groups',
            field=models.ManyToManyField(to='group.Group'),
            preserve_default=True,
        ),
    ]
