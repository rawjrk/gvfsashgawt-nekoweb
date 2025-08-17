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

const datamoshed2 = new DatamoshedImage();
datamoshed2.setDatamoshRange(...moshRange_bytes);
const renderDatamosh2 = async () => {
  const content = datamoshed2.generateMoshedBase64();
  await loadBase64ToCanvas(testCanvas, content, mimeType);
};

// Setup test cases for benchmarking
suite
  .add("DatamoshedImage (background)", function () {
    renderDatamosh1();
  })
  .add("DatamoshedImage (canvas)", {
    defer: true,
    fn: async function (deferred) {
      await renderDatamosh2();
      deferred.resolve();
    },
  });

(async () => {
  // load images
  const imageUrl = `static/images/apple-tree-color-256px.jpeg`;
  await datamoshed1.fetchImage(imageUrl);
  await datamoshed2.fetchImage(imageUrl);

  suite.run({ async: true });
})();
