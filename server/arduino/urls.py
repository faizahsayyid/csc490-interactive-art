from django.urls import path

from .views import (
    SendCodeToBoard, 
    Demo, 
    ProjectListView, 
    ProjectDetailView, 
    GetActionsForDevices, 
    GetRequiredAdditionalParamsForActions,
    InputDeviceListView,
    InputDeviceDetailsView,
    OutputDeviceListView,
    OutputDeviceDetailsView,
    InteractionListView,
    InteractionDetailsView
)

urlpatterns = [
    path('api/', SendCodeToBoard.as_view()),
    path('demo/', Demo.as_view()),
    path('projects/', ProjectListView.as_view()),
    path('projects/<int:project_id>/', ProjectDetailView.as_view()),
    path('actions/', GetActionsForDevices.as_view()),
    path('action-params/', GetRequiredAdditionalParamsForActions.as_view()),
    path('projects/<int:project_id>/input-devices/', InputDeviceListView.as_view()),
    path('projects/<int:project_id>/input-devices/<int:device_id>/', InputDeviceDetailsView.as_view()),
    path('projects/<int:project_id>/output-devices/', OutputDeviceListView.as_view()),
    path('projects/<int:project_id>/output-devices/<int:device_id>/', OutputDeviceDetailsView.as_view()),
    path('projects/<int:project_id>/interactions/', InteractionListView.as_view()),
    path('projects/<int:project_id>/interactions/<int:interaction_id>/', InteractionDetailsView.as_view()),
]
