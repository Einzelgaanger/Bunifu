import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://bunifu.world";
const DEFAULT_TITLE = "Bunifu | University Learning, Collaboration and Careers";
const DEFAULT_DESCRIPTION =
  "Bunifu is a university platform for student learning, collaboration, notes, past papers, messaging, events and career opportunities.";

type SeoRouteConfig = {
  title: string;
  description: string;
  indexable?: boolean;
};

const ROUTE_SEO: Record<string, SeoRouteConfig> = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    indexable: true,
  },
  "/login": {
    title: "Login to Bunifu | Student University Platform",
    description:
      "Access your Bunifu account to continue learning, collaboration, and campus engagement.",
    indexable: true,
  },
  "/application": {
    title: "Apply to Join Bunifu | University Student Access",
    description:
      "Apply for access to Bunifu using your university details and join your class ecosystem.",
    indexable: true,
  },
  "/admin/login": {
    title: "Bunifu Admin Login",
    description: "Secure admin login for Bunifu administrators.",
    indexable: false,
  },
};

const ensureMetaTag = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => tag!.setAttribute(key, value));
    document.head.appendChild(tag);
  }
  return tag;
};

const ensureCanonicalTag = () => {
  let tag = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  return tag;
};

export const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const config = ROUTE_SEO[currentPath] ?? {
      title: "Bunifu App",
      description: "Bunifu student platform application area.",
      indexable: false,
    };

    document.title = config.title;

    const descriptionTag = ensureMetaTag('meta[name="description"]', { name: "description" });
    descriptionTag.setAttribute("content", config.description);

    const robotsTag = ensureMetaTag('meta[name="robots"]', { name: "robots" });
    robotsTag.setAttribute("content", config.indexable ? "index, follow" : "noindex, nofollow");

    const ogTitle = ensureMetaTag('meta[property="og:title"]', { property: "og:title" });
    ogTitle.setAttribute("content", config.title);

    const ogDescription = ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
    });
    ogDescription.setAttribute("content", config.description);

    const ogUrl = ensureMetaTag('meta[property="og:url"]', { property: "og:url" });
    ogUrl.setAttribute("content", `${SITE_URL}${currentPath}`);

    const canonicalTag = ensureCanonicalTag();
    canonicalTag.setAttribute("href", `${SITE_URL}${currentPath}`);
  }, [location.pathname]);

  return null;
};
