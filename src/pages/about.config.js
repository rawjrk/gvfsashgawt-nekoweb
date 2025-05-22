import sharedMetadata, { HOST_URL } from "../sharedMetadata.js";
import navLinks from "../navLinks.js";
import { cssHref, jsSrc } from "../linking.js";

export const title = "Cvte Girly Smonks";

export const metadata = {
  ...sharedMetadata,
  "og:image": `${HOST_URL}/static/thumb/about.png`,
  "og:url": `${HOST_URL}/about`,
};

export const navigation = navLinks.filter((l) => l.text !== "about");

export const styles = cssHref(["global", "pages/about"]);
export const scripts = jsSrc(["lib/gib-core", "lib/gib-events"]);
