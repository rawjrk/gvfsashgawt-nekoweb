import { HOST_URL } from "../sharedMetadata.js";
import navLinks from "../navLinks.js";

export const title = "R.A.W's Gallery";

export const metadata = {
  "og:title": title,
  "og:description": "[UNDER CONSTRUCTION]",
  "og:image": `${HOST_URL}/static/thumb/gallery.png`,
  "og:url": `${HOST_URL}/gallery`,
};

export const navigation = navLinks.filter((l) => l.text !== "gall");
