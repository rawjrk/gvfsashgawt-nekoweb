import sharedMetadata from "../sharedMetadata.js";
import navLinks from "../navLinks.js";

export const title = "F*ck it! Nothing...";

export const metadata = sharedMetadata;

export const navigation = navLinks.filter((l) => l.href !== "/");
