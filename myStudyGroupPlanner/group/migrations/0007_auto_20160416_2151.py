# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0006_auto_20160414_0226'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='group',
            name='access',
        ),
        migrations.RemoveField(
            model_name='group',
            name='meetingPermissions',
        ),
    ]
