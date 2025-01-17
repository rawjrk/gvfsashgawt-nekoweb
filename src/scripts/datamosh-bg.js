async function createDatamoshBackgroundFn(imagePath) {
  const imageBlob = await fetchBlob(imagePath);
  const imageContent = await blobToBase64(imageBlob);

  const injectFrom = 460;
  const injectTo = 500;

  const injectWith_ascii = window.atob(imageContent.slice(injectFrom, injectTo));

  const getDataMoshedContent = () => {
    let randomized = "";

    for (let i = 0; i < injectWith_ascii.length; i++) {
      randomized += getRandomASCII();
    }

    const randomized_base64 = window.btoa(randomized);
    return injectString(imageContent, injectFrom, randomized_base64);
  };

  const datamoshBackground = () => {
    const content = getDataMoshedContent();
    const imageData = `url("data:image/jpeg;base64,${content}")`;
    document.body.style.background = imageData;
  };

  return datamoshBackground;
}

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const contentWithDataPrefix = reader.result;
      const [, bareContent] = contentWithDataPrefix.split(",");
      resolve(bareContent);
    };
    reader.onerror = (error) => console.error(error);
    reader.readAsDataURL(blob);
  });
}

async function fetchBlob(path) {
  const response = await fetch(`${window.location.origin}/${path}`);
  return response.blob();
}

function injectString(originalStr, from, injectedStr) {
  const to = from + injectedStr.length;

  const before = originalStr.slice(0, from);
  const after = originalStr.slice(to);

  return before + injectedStr + after;
}

function getRandomASCII() {
  const charCode = getRandomNumber(256);
  return String.fromCharCode(charCode);
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}
