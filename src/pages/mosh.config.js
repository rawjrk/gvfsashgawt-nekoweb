import sharedMetadata, { HOST_URL } from "../sharedMetadata.js";
import navLinks from "../navLinks.js";

export const title = "Destroy Data, Not People";

export const metadata = {
  ...sharedMetadata,
  "og:title": title,
  "og:description": "Web-tooling for animated Jpeg datamosh",
  "og:image": `${HOST_URL}/static/thumb/mosh.png`,
  "og:url": `${HOST_URL}/mosh`,
};

export const navigation = navLinks.filter((l) => l.text !== "mosh");
