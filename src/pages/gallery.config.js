import sharedMetadata from "../sharedMetadata.js";
import navLinks from "../navLinks.js";

export const title = "R.A.W's Gallery";

export const metadata = {
  ...sharedMetadata,
};

export const navigation = navLinks.filter((l) => l.text !== "gall");
