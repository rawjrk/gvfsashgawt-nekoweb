import sharedMetadata from "../sharedMetadata.js";
import navLinks from "../navLinks.js";

export const title = "Destroy Data, Not People";

export const metadata = {
  ...sharedMetadata,
};

export const navigation = navLinks.filter((l) => l.text !== "mosh");
