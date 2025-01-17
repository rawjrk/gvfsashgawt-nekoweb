const IMAGE_PATH = "static/images/apple-tree-color-256px.jpeg";

window.onload = async () => {
  const datamoshBackground = await createDatamoshBackgroundFn(IMAGE_PATH);
  datamoshBackground();
  setInterval(datamoshBackground, 90);
};
