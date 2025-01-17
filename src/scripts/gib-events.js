document.getElementsByClassName("gib-fill").forEach((elem) => {
  elem.innerText = gibberishSentence();
});

document.getElementsByClassName("gib-link").forEach((elem) => {
  const originalText = elem.innerText;
  elem.innerText = gibberishWord();

  elem.onmouseover = () => {
    elem.innerText = originalText;
  };

  elem.onmouseout = () => {
    elem.innerText = gibberishWord();
  };
});

document.getElementsByClassName("gib-word").forEach((elem) => {
  const originalText = elem.innerText;

  elem.onmouseover = () => {
    elem.innerText = gibberishWord();
  };

  elem.onmouseout = () => {
    elem.innerText = originalText;
  };
});
