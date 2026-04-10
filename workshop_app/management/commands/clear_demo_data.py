from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction

from teams.models import Team
from workshop_app.models import Testimonial, WorkshopType


DEMO_USERNAMES = [
    "demo_coordinator",
    "demo_coordinator_2",
    "demo_instructor",
    "demo_instructor_2",
]

DEMO_WORKSHOP_TYPES = [
    "Introduction to Python",
    "Scientific Computing with Python",
    "Open Source Tools for Engineering",
]

DEMO_TESTIMONIALS = [
    "Megha Deshpande",
    "Rohan Kulshreshtha",
]


class Command(BaseCommand):
    help = "Remove the demo data created by seed_demo_data."

    @transaction.atomic
    def handle(self, *args, **options):
        Team.objects.filter(creator__username__in=DEMO_USERNAMES).delete()
        Testimonial.objects.filter(name__in=DEMO_TESTIMONIALS).delete()
        WorkshopType.objects.filter(name__in=DEMO_WORKSHOP_TYPES).delete()
        User.objects.filter(username__in=DEMO_USERNAMES).delete()
        self.stdout.write(self.style.SUCCESS("Demo data removed."))
