import sharedMetadata from "../sharedMetadata.js";
import navLinks from "../navLinks.js";

export const title = "Be&U@#f^/ Girly Smonks";

export const metadata = {
  ...sharedMetadata,
};

export const navigation = navLinks.filter((l) => l.text !== "about");
