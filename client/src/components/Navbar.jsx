import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@nextui-org/react";
import { useLocation, Link } from "react-router-dom";

import { AcmeLogo } from "./AcmeLogo.jsx";
import { useAuth } from "../store/auth.jsx";

export default function MainNavabar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, LogoutUser, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();
  const [userId, setUserId] = useState(null);

  // Set userId and isAdmin when user data changes
  useEffect(() => {
    if (isLoggedIn && user) {
      setUserId(user._id); // Set user ID
      // console.log("User is logged in, user data:", user);
    }
  }, [isLoggedIn, user]);

  const menuItems = [
    { name: "Home", to: "/" },
    ...(isLoggedIn
      ? [
          { name: "Profile", to: `/${userId}/edit-profile` },
          ...(!isAdmin ? [{ name: "Dashboard", to: `/client/dashboard` }] : []),
          ...(isAdmin ? [{ name: "Dashboard", to: `/admin/dashboard` }] : []),
          { name: "Help & Feedback", to: "/contact" },
          { name: "FAQ", to: "/faq" },
          { name: "Log Out", onClick: LogoutUser },
        ]
      : []),
    !isLoggedIn && { name: "Help & Feedback", to: "/contact" },
    !isLoggedIn && { name: "FAQ", to: "/faq" },
    !isLoggedIn && { name: "Rules", to: "/rule-regulations" },
    ...(isLoggedIn ? [] : [{ name: "Log In", to: "/login" }]), // For when not logged in
  ].filter(Boolean); // filter to remove falsey values

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link to="/" color="foreground">
            <AcmeLogo />
            <p className="font-bold text-inherit">Hostellers</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            to="/"
            aria-current="page"
            color="foreground"
            className={`${
              location.pathname === "/" ? "font-bold text-blue-500" : ""
            }`}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          {isLoggedIn && (
            <>
              {isAdmin && (
                <Link
                  to={`/admin/dashboard`} // Admin Dashboard URL
                  color="foreground"
                  className={`${
                    location.pathname === `/admin/dashboard`
                      ? "font-bold text-blue-500"
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}
              {!isAdmin && (
                <Link
                  to={`/client/dashboard`} // User Dashboard URL
                  color="foreground"
                  className={`${
                    location.pathname === `/client/dashboard`
                      ? "font-bold text-blue-500"
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </>
          )}
        </NavbarItem>

        <NavbarItem>
          <Link
            to="/contact"
            color="foreground"
            className={`${
              location.pathname === "/contact" ? "font-bold text-blue-500" : ""
            }`}
          >
            Help
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            to="/rule-regulations"
            color="foreground"
            className={`${
              location.pathname === "/rule-regulations"
                ? "font-bold text-blue-500"
                : ""
            }`}
          >
            Rules
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          {isLoggedIn ? (
            <Button
              as={Link}
              color="danger"
              onClick={LogoutUser}
              variant="flat"
            >
              Logout
            </Button>
          ) : (
            <Button as={Link} color="primary" to="/login" variant="flat">
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              to={item.to}
              className={`w-full ${
                location.pathname === item.to ? "font-bold text-blue-500" : ""
              }`}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
