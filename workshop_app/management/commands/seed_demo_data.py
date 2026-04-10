from datetime import timedelta

from django.contrib.auth.models import Group, User
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from teams.models import Team
from workshop_app.models import Comment, Profile, Testimonial, Workshop, WorkshopType


DEMO_PREFIX = "demo_"
DEMO_EMAIL_DOMAIN = "@demo.local"


class Command(BaseCommand):
    help = "Create demo users, workshop types, workshops, comments, testimonials, and a team for UI review."

    @transaction.atomic
    def handle(self, *args, **options):
        instructor_group, _ = Group.objects.get_or_create(name="instructor")

        users = {
            "coordinator": self.create_user(
                username="demo_coordinator",
                password="demo12345",
                first_name="Riya",
                last_name="Kulkarni",
                email="demo_coordinator@demo.local",
                institute="Vidya Pratishthan College of Engineering",
                department="computer engineering",
                location="Pune",
                state="IN-MH",
                position="coordinator",
            ),
            "instructor_1": self.create_user(
                username="demo_instructor",
                password="demo12345",
                first_name="Nikhil",
                last_name="Patil",
                email="demo_instructor@demo.local",
                institute="IIT Bombay",
                department="information technology",
                location="Mumbai",
                state="IN-MH",
                position="instructor",
            ),
            "instructor_2": self.create_user(
                username="demo_instructor_2",
                password="demo12345",
                first_name="Asha",
                last_name="Menon",
                email="demo_instructor_2@demo.local",
                institute="IIT Bombay",
                department="electronics",
                location="Mumbai",
                state="IN-MH",
                position="instructor",
            ),
            "coordinator_2": self.create_user(
                username="demo_coordinator_2",
                password="demo12345",
                first_name="Karan",
                last_name="Jain",
                email="demo_coordinator_2@demo.local",
                institute="Government Polytechnic Nagpur",
                department="mechanical engineering",
                location="Nagpur",
                state="IN-MH",
                position="coordinator",
            ),
        }

        users["instructor_1"].groups.add(instructor_group)
        users["instructor_2"].groups.add(instructor_group)

        workshop_types = [
            WorkshopType.objects.get_or_create(
                name="Introduction to Python",
                defaults={
                    "description": "Basics of Python, problem solving, and small scripting tasks for beginners.",
                    "duration": 2,
                    "terms_and_conditions": "Venue and lab systems should be ready before the workshop date."
                },
            )[0],
            WorkshopType.objects.get_or_create(
                name="Scientific Computing with Python",
                defaults={
                    "description": "Numerical computing, plotting, and core scientific Python tools.",
                    "duration": 3,
                    "terms_and_conditions": "Participants should have Python installed before the workshop starts."
                },
            )[0],
            WorkshopType.objects.get_or_create(
                name="Open Source Tools for Engineering",
                defaults={
                    "description": "A practical session introducing open source tools used in engineering classrooms.",
                    "duration": 1,
                    "terms_and_conditions": "The coordinator should confirm participant count at least two days in advance."
                },
            )[0],
        ]

        today = timezone.localdate()
        accepted_one, _ = Workshop.objects.get_or_create(
            coordinator=users["coordinator"],
            instructor=users["instructor_1"],
            workshop_type=workshop_types[0],
            date=today + timedelta(days=12),
            defaults={"status": 1, "tnc_accepted": True},
        )
        pending_one, _ = Workshop.objects.get_or_create(
            coordinator=users["coordinator"],
            instructor=None,
            workshop_type=workshop_types[1],
            date=today + timedelta(days=20),
            defaults={"status": 0, "tnc_accepted": True},
        )
        accepted_two, _ = Workshop.objects.get_or_create(
            coordinator=users["coordinator_2"],
            instructor=users["instructor_2"],
            workshop_type=workshop_types[2],
            date=today + timedelta(days=8),
            defaults={"status": 1, "tnc_accepted": True},
        )
        pending_two, _ = Workshop.objects.get_or_create(
            coordinator=users["coordinator_2"],
            instructor=None,
            workshop_type=workshop_types[0],
            date=today + timedelta(days=16),
            defaults={"status": 0, "tnc_accepted": True},
        )

        Comment.objects.get_or_create(
            author=users["instructor_1"],
            workshop=accepted_one,
            defaults={
                "comment": "Please confirm the lab availability and projector setup before the session.",
                "public": True,
            },
        )
        Comment.objects.get_or_create(
            author=users["coordinator"],
            workshop=accepted_one,
            defaults={
                "comment": "Lab is ready and the final participant list will be shared tomorrow.",
                "public": True,
            },
        )
        Comment.objects.get_or_create(
            author=users["instructor_2"],
            workshop=accepted_two,
            defaults={
                "comment": "A short pre-read has been shared with the students.",
                "public": False,
            },
        )

        Testimonial.objects.get_or_create(
            name="Megha Deshpande",
            institute="Pimpri Chinchwad Polytechnic",
            department="computer engineering",
            message="The workshop was clear, practical, and easy for first-time learners to follow.",
        )
        Testimonial.objects.get_or_create(
            name="Rohan Kulshreshtha",
            institute="Government College of Engineering",
            department="electrical engineering",
            message="The booking process was smooth and the workshop content was well structured.",
        )

        team, _ = Team.objects.get_or_create(creator=users["instructor_1"])
        team.members.add(users["instructor_1"].profile, users["instructor_2"].profile)

        self.stdout.write(self.style.SUCCESS("Demo data created."))
        self.stdout.write("Demo logins:")
        self.stdout.write("  coordinator: demo_coordinator / demo12345")
        self.stdout.write("  coordinator: demo_coordinator_2 / demo12345")
        self.stdout.write("  instructor: demo_instructor / demo12345")
        self.stdout.write("  instructor: demo_instructor_2 / demo12345")

    def create_user(self, username, password, first_name, last_name, email, institute, department, location, state, position):
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
            },
        )
        if created:
            user.set_password(password)
            user.save()

        profile, _ = Profile.objects.get_or_create(
            user=user,
            defaults={
                "title": "Mr" if position == "instructor" else "Miss",
                "institute": institute,
                "department": department,
                "phone_number": "9999999999",
                "position": position,
                "how_did_you_hear_about_us": "Google",
                "location": location,
                "state": state,
                "is_email_verified": True,
            },
        )

        profile.title = profile.title or ("Mr" if position == "instructor" else "Miss")
        profile.institute = institute
        profile.department = department
        profile.phone_number = "9999999999"
        profile.position = position
        profile.how_did_you_hear_about_us = "Google"
        profile.location = location
        profile.state = state
        profile.is_email_verified = True
        profile.save()

        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.set_password(password)
        user.save()
        return user
