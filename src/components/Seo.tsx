import { useEffect } from "react";

const SITE_NAME = "ClickStation";
const DEFAULT_DESCRIPTION =
  "Professional Windows photo booth software for photographers, rental teams, and event experiences.";

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
}: {
  title: string;
  description?: string;
  path?: string;
}) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);

    if (path) {
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `${window.location.origin}${path}`;
      setMeta('meta[property="og:url"]', "property", "og:url", canonical.href);
    }
  }, [description, path, title]);

  return null;
}
