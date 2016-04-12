# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('subject', models.CharField(max_length=30)),
                ('className', models.CharField(max_length=30)),
                ('section', models.IntegerField()),
                ('groupOwner', models.CharField(max_length=30)),
                ('memberCount', models.IntegerField()),
                ('totalMembersAllowed', models.IntegerField()),
                ('access', models.CharField(max_length=10)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
