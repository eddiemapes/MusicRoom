from django.urls import path
from . import views

urlpatterns = [
    path('', views.RoomView.as_view(), name='home'),
    path('create-room', views.CreateRoomView.as_view(), name='create_room'),
    path('get-room', views.GetRoom.as_view(), name='get_room'),
]