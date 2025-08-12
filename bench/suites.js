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

const moshRange_bytes = [345, 375];

const datamoshed1 = new DatamoshedImage();
datamoshed1.setDatamoshRange(...moshRange_bytes);

// Setup test cases for benchmarking
suite.add("DatamoshedImage (current)", function () {
  datamoshed1.generateMoshedBase64();
});

(async () => {
  // load images
  const imageUrl = `static/images/apple-tree-color-256px.jpeg`;
  await datamoshed1.fetchImage(imageUrl);

  suite.run({ async: true });
})();
