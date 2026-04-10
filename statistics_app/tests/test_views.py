from datetime import timedelta

from django.contrib.auth.models import Group, User
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from teams.models import Team
from workshop_app.models import Profile, Workshop, WorkshopType


class StatisticsViewTests(TestCase):
    def setUp(self):
        self.instructor_group = Group.objects.create(name="instructor")
        self.instructor = User.objects.create_user(
            username="instructor",
            password="pass@123",
            email="instructor@example.com",
            first_name="Ira",
            last_name="Instructor",
        )
        self.coordinator = User.objects.create_user(
            username="coordinator",
            password="pass@123",
            email="coordinator@example.com",
            first_name="Cora",
            last_name="Coordinator",
        )
        self.outsider = User.objects.create_user(
            username="outsider",
            password="pass@123",
            email="outsider@example.com",
            first_name="Otis",
            last_name="Outsider",
        )

        self.instructor_group.user_set.add(self.instructor)

        self.instructor_profile = self._create_profile(self.instructor, "instructor")
        self.coordinator_profile = self._create_profile(self.coordinator, "coordinator")
        self.outsider_profile = self._create_profile(self.outsider, "instructor")

        self.workshop_type = WorkshopType.objects.create(
            name="Introduction to Python",
            description="A basic Python workshop.",
            duration=2,
            terms_and_conditions="Bring a laptop and projector access.",
        )
        Workshop.objects.create(
            coordinator=self.coordinator,
            instructor=self.instructor,
            workshop_type=self.workshop_type,
            date=timezone.now().date() + timedelta(days=7),
            status=1,
            tnc_accepted=True,
        )

        self.team = Team.objects.create(creator=self.instructor)
        self.team.members.add(self.instructor_profile)

    def _create_profile(self, user, position):
        return Profile.objects.create(
            user=user,
            title="Mr",
            institute="FOSSEE",
            department="computer engineering",
            phone_number="9876543210",
            position=position,
            how_did_you_hear_about_us="FOSSEE website",
            location="Mumbai",
            state="IN-MH",
            is_email_verified=True,
        )

    def test_public_statistics_page_renders(self):
        response = self.client.get(reverse("statistics_app:public"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "react-page-root")

    def test_public_statistics_supports_filter_query(self):
        response = self.client.get(
            reverse("statistics_app:public"),
            {
                "from_date": timezone.now().date().isoformat(),
                "to_date": (timezone.now().date() + timedelta(days=30)).isoformat(),
                "workshop_type": self.workshop_type.id,
                "state": "IN-MH",
                "sort": "date",
            },
        )
        self.assertEqual(response.status_code, 200)

    def test_team_statistics_page_renders_for_team_member(self):
        self.client.force_login(self.instructor)
        response = self.client.get(reverse("statistics_app:team"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "team-stats")

    def test_team_statistics_redirects_for_non_member(self):
        self.client.force_login(self.outsider)
        response = self.client.get(reverse("statistics_app:team"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(
            response,
            reverse("workshop_app:index"),
            target_status_code=302,
        )
