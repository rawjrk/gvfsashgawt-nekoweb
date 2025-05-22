/**
 * @typedef {import ('../lib/datamosh.js').DatamoshedImage} DatamoshedImage
 */

window.onload = async () => {
  const imageUrl = "static/images/apple-tree-color-256px.jpeg";

  const moshedImage = new DatamoshedImage();
  await moshedImage.fetchImage(imageUrl);
  moshedImage.setDatamoshRange(345, 375);

  const datamoshBackground = () => {
    const content = moshedImage.generateMoshedBase64();
    const imageData = `url("data:image/jpeg;base64,${content}")`;
    document.body.style.background = imageData;
  };

  datamoshBackground();
  document.body.onclick = datamoshBackground;
};
