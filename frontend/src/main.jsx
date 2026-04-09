import React from "react";
import { createRoot } from "react-dom/client";

import { NavShell } from "./components/layout/NavShell";
import { PageIntro } from "./components/layout/PageIntro";
import { CoordinatorDashboardPage } from "./pages/CoordinatorDashboardPage";
import { InstructorDashboardPage } from "./pages/InstructorDashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { ProposeWorkshopPage } from "./pages/ProposeWorkshopPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { TeamStatsPage } from "./pages/TeamStatsPage";
import { WorkshopDetailsPage } from "./pages/WorkshopDetailsPage";
import { WorkshopTypeDetailsPage } from "./pages/WorkshopTypeDetailsPage";
import { WorkshopTypesPage } from "./pages/WorkshopTypesPage";
import { parseBoolean, readDataAttributes, readJsonScript } from "./lib/dom";

function mountNavShell(element) {
  const data = readDataAttributes(element);

  createRoot(element).render(
    <NavShell
      brandLabel={data.brandLabel}
      brandHref={data.brandHref}
      currentPath={data.currentPath}
      isAuthenticated={parseBoolean(data.isAuthenticated)}
      isInstructor={parseBoolean(data.isInstructor)}
      profileName={data.profileName}
      profileHref={data.profileHref}
      passwordHref={data.passwordHref}
      logoutHref={data.logoutHref}
      loginHref={data.loginHref}
      registerHref={data.registerHref}
      publicStatsHref={data.publicStatsHref}
      teamStatsHref={data.teamStatsHref}
      workshopStatusHref={data.workshopStatusHref}
      proposeHref={data.proposeHref}
      workshopTypesHref={data.workshopTypesHref}
    />
  );
}

function mountPageIntro(element) {
  createRoot(element).render(<PageIntro {...readDataAttributes(element)} />);
}

function mountPageRoot(element) {
  const page = readJsonScript("react-page-data");
  const meta = readDataAttributes(element);

  const pages = {
    login: <LoginPage page={page} meta={meta} />,
    register: <RegisterPage page={page} meta={meta} />,
    "coordinator-dashboard": <CoordinatorDashboardPage page={page} meta={meta} />,
    "instructor-dashboard": <InstructorDashboardPage page={page} meta={meta} />,
    "workshop-types": <WorkshopTypesPage page={page} meta={meta} />,
    "propose-workshop": <ProposeWorkshopPage page={page} meta={meta} />,
    "profile-page": <ProfilePage page={page} meta={meta} />,
    statistics: <StatisticsPage page={page} meta={meta} />,
    "team-stats": <TeamStatsPage page={page} meta={meta} />,
    "workshop-details": <WorkshopDetailsPage page={page} meta={meta} />,
    "workshop-type-details": <WorkshopTypeDetailsPage page={page} meta={meta} />,
  };

  createRoot(element).render(pages[meta.reactPage] || null);
}

document.querySelectorAll("[data-react-shell='nav']").forEach(mountNavShell);
document.querySelectorAll("[data-react-shell='intro']").forEach(mountPageIntro);
document.querySelectorAll("#react-page-root").forEach(mountPageRoot);
