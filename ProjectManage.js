const createIssuebtnElements =
  document.getElementsByClassName("createIssuebtn");
const formElement = document.querySelector("form");

formElement.addEventListener("submit", saveIssue);
formElement.addEventListener("reset", closemodal);

[...createIssuebtnElements].forEach(function (element) {
  console.log(element);
  element.addEventListener("click", showmodal);
});

function showmodal(event) {
  const modalElement = document.getElementById("config-overlay");
  modalElement.style.display = "block";
}

function closemodal() {
  const modalElement = document.getElementById("config-overlay");
  modalElement.style.display = "none";
}
function saveIssue(event) {
  event.preventDefault(); //리로드 안함.
  const formData = new FormData(event.target);

  //이슈를 DB에 저장하는 함수

  makeIssue(formData);
}

function makeIssue(formData) {
  const title = formData.get("title");
  const descricption = formData.get("description");
  const priority = formData.get("priority");

  const newIssueElement = document.createElement("li");
  newIssueElement.append(title);

  const newBoardElement = document.getElementById("new");
  newBoardElement.children[1].appendChild(newIssueElement);

  const modalElement = document.getElementById("config-overlay");
  modalElement.style.display = "none";
  modalElement.children[1].reset();
}
