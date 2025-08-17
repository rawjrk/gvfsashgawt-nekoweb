console.log("Running benchmark...");

const suite = new Benchmark.Suite({
  onCycle: function (event) {
    console.log(String(event.target));
  },
  onComplete: function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  },
  onError: function (event) {
    console.error(event.target.error);
  },
});

const testDiv = document.getElementById("test-div");
const testCanvas = document.getElementById("test-canvas");

const moshRange_bytes = [345, 375];
const mimeType = "image/jpeg";

const datamoshed1 = new DatamoshedImage();
datamoshed1.setDatamoshRange(...moshRange_bytes);
const renderDatamosh1 = () => {
  const content = datamoshed1.generateMoshedBase64();
  const imageData = `url("data:${mimeType};base64,${content}")`;
  testDiv.style.background = imageData;
};

const datamoshed2 = new DatamoshedFile();
datamoshed2.setDatamoshRange(...moshRange_bytes);
const renderDatamosh2 = async () => {
  const bytes = datamoshed2.generateMoshedBytes();
  await loadBytesToCanvas(testCanvas, bytes, mimeType);
};

// Setup test cases for benchmarking
suite
  .add("DatamoshedImage (current)", function () {
    renderDatamosh1();
  })
  .add("DatamoshedFile (new)", function () {
    return renderDatamosh2();
  });

(async () => {
  // load images
  const imageUrl = `static/images/apple-tree-color-256px.jpeg`;
  await datamoshed1.fetchImage(imageUrl);
  await datamoshed2.fetchFile(imageUrl);

  suite.run({ async: true });
})();
