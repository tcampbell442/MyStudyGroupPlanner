from django.conf.urls import patterns, url, include
from django.contrib import admin

from myStudyGroupPlanner.views import IndexView

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView
from building.views import RoomList, RoomDetail
from group.views import GroupList, GroupDetail

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
    
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^admin/', include(admin.site.urls)),
    #remove this to see your api calls printout on browser
    url('^.*$', IndexView.as_view(), name='index'),
)
