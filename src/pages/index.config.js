import { cssHref, jsSrc } from "../linking.js";
import navLinks from "../navLinks.js";
import sharedMetadata from "../sharedMetadata.js";

export const title = "F*ck it! Nothing...";

export const metadata = sharedMetadata;

export const navigation = navLinks.filter((l) => l.href !== "/");

export const styles = cssHref(["global", "pages/home"]);
export const scripts = jsSrc(["lib/gib-core", "lib/gib-events", "lib/datamosh", "pages/home"]);
