import sharedMetadata, { HOST_URL } from "../sharedMetadata.js";
import navLinks from "../navLinks.js";
import { cssHref, jsSrc } from "../linking.js";

export const title = "Destroy Data, Not People!";

const RED_SQUARE_EMOJI = "\uD83D\uDFE5";

export const metadata = {
  ...sharedMetadata,
  "og:title": `${RED_SQUARE_EMOJI} ${title}`,
  "og:description": "Webtool for LIVE GLITCH animations",
  "og:image": `${HOST_URL}/static/thumb/mosh.png`,
  "og:url": `${HOST_URL}/mosh`,
};

export const navigation = navLinks.filter((l) => l.text !== "mosh");

export const styles = cssHref(["pages/mosh"]);
export const scripts = jsSrc(["lib/datamosh", "lib/controls", "lib/interval", "pages/mosh"]);
