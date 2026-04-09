import React, { useEffect, useMemo, useRef, useState } from "react";

export function NavShell({
  brandLabel,
  brandHref,
  currentPath,
  isAuthenticated,
  isInstructor,
  profileName,
  profileHref,
  passwordHref,
  logoutHref,
  loginHref,
  registerHref,
  publicStatsHref,
  teamStatsHref,
  workshopStatusHref,
  proposeHref,
  workshopTypesHref,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const shellRef = useRef(null);
  const accountRef = useRef(null);

  const primaryLinks = useMemo(() => {
    const links = [
      { label: "Home", href: "/" },
      { label: "Workshop Statistics", href: publicStatsHref },
    ];

    if (isAuthenticated) {
      if (isInstructor) {
        links.push({ label: "Team Statistics", href: teamStatsHref });
      }

      links.push({ label: "Workshop Status", href: workshopStatusHref });

      if (!isInstructor && proposeHref) {
        links.push({ label: "Propose Workshop", href: proposeHref });
      }

      links.push({ label: "Workshop Types", href: workshopTypesHref });
    }

    return links;
  }, [isAuthenticated, isInstructor, proposeHref, publicStatsHref, teamStatsHref, workshopStatusHref, workshopTypesHref]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (shellRef.current && !shellRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function isActive(href) {
    if (!href) {
      return false;
    }
    if (href === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(href);
  }

  return (
    <header className={`app-shell ${menuOpen ? "is-open" : ""}`}>
      <div className="shell-topbar" ref={shellRef}>
        <a className="shell-brand" href={brandHref}>
          <strong>{brandLabel}</strong>
        </a>

        <button
          type="button"
          className="shell-toggle"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setAccountOpen(false);
          }}
          aria-expanded={menuOpen}
          aria-controls="shell-nav-panel"
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="shell-nav-panel" className={`shell-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary">
          <div className="shell-nav-links">
            {primaryLinks.map((link) => (
              <a
                key={link.href}
                className={`shell-link ${isActive(link.href) ? "is-active" : ""}`}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="shell-nav-actions">
            {isAuthenticated ? (
              <div className={`shell-account ${accountOpen ? "is-open" : ""}`} ref={accountRef}>
                <button
                  type="button"
                  className="shell-account-trigger"
                  onClick={() => setAccountOpen(!accountOpen)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <span className="shell-account-copy">
                    <strong>{profileName || "Profile"}</strong>
                  </span>
                </button>
                <div className="shell-account-menu" role="menu">
                  <a href={profileHref} role="menuitem">Profile</a>
                  <a href={passwordHref} role="menuitem">Change password</a>
                  <a href={logoutHref} role="menuitem">Log out</a>
                </div>
              </div>
            ) : (
              <div className="shell-auth-links">
                <a className="shell-link" href={loginHref}>Login</a>
                <a className="shell-button" href={registerHref}>Register</a>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
