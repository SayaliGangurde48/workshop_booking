from datetime import timedelta

from django.contrib.auth.models import Group, User
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from workshop_app.models import Profile, Workshop, WorkshopType, has_profile


class WorkshopAppViewTests(TestCase):
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
        self.no_profile_user = User.objects.create_user(
            username="noprof",
            password="pass@123",
            email="noprof@example.com",
        )

        self.instructor_group.user_set.add(self.instructor)

        self._create_profile(self.instructor, "instructor")
        self._create_profile(self.coordinator, "coordinator")

        self.workshop_type = WorkshopType.objects.create(
            name="Introduction to Python",
            description="A basic Python workshop.",
            duration=2,
            terms_and_conditions="Bring a laptop and projector access.",
        )
        self.accepted_workshop = Workshop.objects.create(
            coordinator=self.coordinator,
            instructor=self.instructor,
            workshop_type=self.workshop_type,
            date=timezone.now().date() + timedelta(days=7),
            status=1,
            tnc_accepted=True,
        )
        self.pending_workshop = Workshop.objects.create(
            coordinator=self.coordinator,
            instructor=self.instructor,
            workshop_type=self.workshop_type,
            date=timezone.now().date() + timedelta(days=14),
            status=0,
            tnc_accepted=True,
        )

    def _create_profile(self, user, position):
        Profile.objects.create(
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

    def test_has_profile_helper(self):
        self.assertTrue(has_profile(self.coordinator))
        self.assertFalse(has_profile(self.no_profile_user))

    def test_login_page_renders(self):
        response = self.client.get(reverse("workshop_app:login"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "react-page-root")

    def test_register_page_renders(self):
        response = self.client.get(reverse("workshop_app:register"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "react-page-root")

    def test_workshop_type_list_renders(self):
        response = self.client.get(reverse("workshop_app:workshop_type_list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Workshop Types")

    def test_coordinator_dashboard_renders_for_authenticated_user(self):
        self.client.force_login(self.coordinator)
        response = self.client.get(reverse("workshop_app:workshop_status_coordinator"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "coordinator-dashboard")

    def test_instructor_dashboard_renders_for_authenticated_instructor(self):
        self.client.force_login(self.instructor)
        response = self.client.get(reverse("workshop_app:workshop_status_instructor"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "instructor-dashboard")

    def test_propose_workshop_page_renders_for_coordinator(self):
        self.client.force_login(self.coordinator)
        response = self.client.get(reverse("workshop_app:propose_workshop"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "propose-workshop")

    def test_workshop_details_page_renders(self):
        self.client.force_login(self.coordinator)
        response = self.client.get(
            reverse("workshop_app:workshop_details", args=[self.accepted_workshop.id])
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.workshop_type.name)
