window.onload = async () => {
  const imageUrl = "static/images/apple-tree-color-256px.jpeg";

  const datamoshedJpeg = new DatamoshedJpeg(imageUrl, [460, 500]);
  await datamoshedJpeg.fetchImage();

  const datamoshBackground = () => {
    const content = datamoshedJpeg.generateMoshedBase64();
    const imageData = `url("data:image/jpeg;base64,${content}")`;
    document.body.style.background = imageData;
  };

  datamoshBackground();
  document.body.onclick = datamoshBackground;
};
