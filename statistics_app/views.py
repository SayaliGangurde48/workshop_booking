# Python Imports
import datetime as dt
import pandas as pd

# Django Imports
from django.template.loader import get_template
from django.template import RequestContext
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone
from django.http import HttpResponse

# Local Imports
from workshop_app.models import (
    Profile, User, has_profile, Workshop, WorkshopType, Testimonial,
    states
)
from workshop_app.ui_data import serialize_form, serialize_pagination
from teams.models import Team
from .forms import FilterForm


def is_instructor(user):
    '''Check if the user is having instructor rights'''
    return user.groups.filter(name='instructor').exists()


def is_email_checked(user):
    if hasattr(user, 'profile'):
        return user.profile.is_email_verified
    else:
        return False


def workshop_public_stats(request):
    user = request.user
    form = FilterForm()
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    state = request.GET.get('state')
    workshoptype = request.GET.get('workshop_type')
    show_workshops = request.GET.get('show_workshops')
    sort = request.GET.get('sort')
    download = request.GET.get('download')

    if from_date and to_date:
        form = FilterForm(
            start=from_date, end=to_date, state=state, type=workshoptype,
            show_workshops=show_workshops, sort=sort
        )
        workshops = Workshop.objects.filter(
            date__range=(from_date, to_date), status=1
        ).order_by(sort)
        if state:
            workshops = workshops.filter(coordinator__profile__state=state)
        if workshoptype:
            workshops = workshops.filter(workshop_type_id=workshoptype)
    else:
        today = timezone.now()
        upto = today + dt.timedelta(days=15)
        workshops = Workshop.objects.filter(
            date__range=(today, upto), status=1
            ).order_by("date")
    if show_workshops:
        if is_instructor(user):
            workshops = workshops.filter(instructor_id=user.id)
        else:
            workshops = workshops.filter(coordinator_id=user.id)
    if download:
        data = workshops.values(
            "workshop_type__name", "coordinator__first_name",
            "coordinator__last_name", "instructor__first_name",
            "instructor__last_name", "coordinator__profile__state",
            "date", "status"
        )
        df = pd.DataFrame(list(data))
        if not df.empty:
            df.status.replace(
                [0, 1, 2], ['Pending', 'Success', 'Reject'], inplace=True
            )
            codes, states_map = list(zip(*states))
            df.coordinator__profile__state.replace(
                codes, states_map, inplace=True
            )
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename=statistics.csv'
            output_file = df.to_csv(response, index=False)
            return response
        else:
            messages.add_message(request, messages.WARNING, "No data found")
    ws_states, ws_count = Workshop.objects.get_workshops_by_state(workshops)
    ws_type, ws_type_count = Workshop.objects.get_workshops_by_type(workshops)
    paginator = Paginator(workshops, 30)
    page = request.GET.get('page')
    workshops = paginator.get_page(page)
    results = []
    for index, workshop in enumerate(workshops, start=workshops.start_index()):
        results.append({
            "index": index,
            "coordinator": workshop.coordinator.get_full_name(),
            "institute": workshop.coordinator.profile.institute,
            "instructor": workshop.instructor.get_full_name(),
            "workshop": workshop.workshop_type.name,
            "date": workshop.date.strftime("%B %d, %Y"),
        })
    field_names = ["from_date", "to_date", "workshop_type", "state", "sort"]
    if request.user.is_authenticated:
        field_names.append("show_workshops")

    context = {"form": form, "objects": workshops, "ws_states": ws_states,
               "ws_count": ws_count, "ws_type": ws_type,
               "ws_type_count": ws_type_count,
               "page_data": {
                   "form": serialize_form(form, field_names),
                   "results": results,
                   "pagination": serialize_pagination(workshops),
                   "charts": {
                       "states": {"labels": ws_states, "values": ws_count},
                       "types": {"labels": ws_type, "values": ws_type_count},
                   },
               }}
    return render(
        request, 'statistics_app/workshop_public_stats.html', context
    )


@login_required
def team_stats(request, team_id=None):
    user = request.user
    teams = Team.objects.all()
    if not teams.exists():
        messages.add_message(
            request, messages.INFO, "No teams have been created yet."
        )
        return redirect(reverse("workshop_app:index"))

    if team_id:
        team = teams.filter(id=team_id).first()
    else:
        team = teams.first()

    if team is None:
        team = teams.first()
    if not team.members.filter(user_id=user.id).exists():
        messages.add_message(
            request, messages.INFO, "You are not added to the team"
        )
        return redirect(reverse("workshop_app:index"))

    indexed_teams = list(enumerate(teams, start=1))
    member_workshop_data = []
    for member in team.members.all():
        workshop_count = Workshop.objects.filter(
            instructor_id=member.user.id).count()
        member_workshop_data.append({
            "name": member.user.get_full_name() or member.user.username,
            "count": workshop_count,
        })

    team_index = next(
        (index for index, current_team in indexed_teams if current_team.id == team.id),
        1
    )
    total_workshops = sum(item["count"] for item in member_workshop_data)
    active_members = sum(1 for item in member_workshop_data if item["count"] > 0)

    return render(
        request, 'statistics_app/team_stats.html',
        {
            'page_data': {
                "selected_team_label": f"Team {team_index}",
                "teams": [
                    {
                        "id": current_team.id,
                        "label": f"Team {index}",
                        "href": reverse("statistics_app:team", args=[current_team.id]),
                        "active": current_team.id == team.id,
                        "member_count": current_team.members.count(),
                    }
                    for index, current_team in indexed_teams
                ],
                "members": member_workshop_data,
                "chart": {
                    "labels": [item["name"] for item in member_workshop_data],
                    "values": [item["count"] for item in member_workshop_data],
                },
                "summary": {
                    "member_count": len(member_workshop_data),
                    "active_members": active_members,
                    "total_workshops": total_workshops,
                },
            }
        }
    )
