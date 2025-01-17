const gibFills = document.getElementsByClassName("gib-fill");

for (const elem of gibFills) {
  elem.innerText = gibberishSentence();
}

const gibLinks = document.getElementsByClassName("gib-link");

for (const elem of gibLinks) {
  const originalText = elem.innerText;
  elem.innerText = gibberishWord(originalText.length);

  const onmouseoutHandler = () => {
    elem.innerText = gibberishWord(originalText.length);
  };

  elem.onmouseover = () => {
    elem.innerText = originalText;
    elem.addEventListener("mouseout", onmouseoutHandler, { once: true });
  };
}

const gibWords = document.getElementsByClassName("gib-word");

for (const elem of gibWords) {
  const originalText = elem.innerText;

  const onmouseoutHandler = (event) => {
    event.target.innerText = originalText;
  };

  elem.onmouseover = (event) => {
    event.target.innerText = gibberishWord(originalText.length);
    event.target.addEventListener("mouseout", onmouseoutHandler, { once: true });
  };
}
