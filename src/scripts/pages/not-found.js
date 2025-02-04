/**
 * @typedef DatamoshedJpeg
 * @type {import ('../lib/datamosh-jpeg.js').DatamoshedJpeg}
 */

window.onload = async () => {
  const imageUrl = "static/images/apple-tree-color-256px.jpeg";

  const datamoshedJpeg = new DatamoshedJpeg();
  await datamoshedJpeg.fetchImage(imageUrl);
  datamoshedJpeg.setDatamoshRange(115, 125);

  const datamoshBackground = () => {
    const content = datamoshedJpeg.generateMoshedBase64();
    const imageData = `url("data:image/jpeg;base64,${content}")`;
    document.body.style.background = imageData;
  };

  datamoshBackground();
  document.body.onclick = datamoshBackground;
};
