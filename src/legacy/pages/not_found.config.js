import { cssHref, jsSrc } from "../linking.js";
import navLinks from "../navLinks.js";
import sharedMetadata from "../sharedMetadata.js";

export const title = "Oops! Jerk Not Found";

export const metadata = sharedMetadata;

export const navigation = navLinks;

export const styles = cssHref(["global", "pages/not_found"]);
export const scripts = jsSrc(["lib/gib-core", "lib/gib-events", "lib/datamosh", "pages/not-found"]);
