# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='groupName',
            field=models.CharField(default='error', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='group',
            name='meetingPermissions',
            field=models.CharField(default='error', max_length=20),
            preserve_default=False,
        ),
    ]
