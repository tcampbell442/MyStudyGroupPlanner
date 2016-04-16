from django.conf.urls import patterns, url, include
from django.contrib import admin

from myStudyGroupPlanner.views import IndexView

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView
from building.views import RoomList, RoomDetail
from group.views import GroupList, GroupDetail, UserList, UserDetail
from meeting.views import MeetingList, MeetingDetail
from report.views import ReportList, ReportDetail

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)

#router.register(r'building', RoomList)

urlpatterns = patterns(
     '',
    # ... URLs
    url(r'^api/building/$', RoomList.as_view(), name='roomList'),
    url(r'^api/building/(?P<pk>[0-9]+)/$', RoomDetail.as_view(), name='roomDetail'),

	url(r'^api/group/$', GroupList.as_view(), name='groupList'),
	url(r'^api/group/(?P<pk>[0-9]+)/$', GroupDetail.as_view(), name='groupDetail'),

	url(r'^api/meeting/$', MeetingList.as_view(), name='meetingList'),
	url(r'^api/meeting/(?P<pk>[0-9]+)/$', MeetingDetail.as_view(), name='meetingDetail'),

	url(r'^api/group/user/$', UserList.as_view(), name='userList'),
        url(r'^api/group/user/(?P<pk>[0-9]+)/$', UserDetail.as_view(), name='userDetail'),

	#url(r'^api/account/$', AccountList.as_view(), name='accountList'),

    url(r'^api/report/$', ReportList.as_view(), name='reportList'),
	url(r'^api/report/(?P<pk>[0-9]+)/$', ReportDetail.as_view(), name='reportDetail'),

    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^admin/', include(admin.site.urls)),
    #remove this to see your api calls printout on browser
    url('^.*$', IndexView.as_view(), name='index'),
)
