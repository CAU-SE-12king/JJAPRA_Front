const createIssuebtnElements =
  document.getElementsByClassName("createIssuebtn");
const formElement = document.querySelector("form");

// formElement.addEventListener("submit", saveIssue);

[...createIssuebtnElements].forEach(function (element) {
  console.log(element);
  element.addEventListener("click", showmodal);
});

function showmodal(event) {
  const modalElement = document.getElementById("config-overlay");
  modalElement.style.display = "block";
}

// function saveIssue(event) {
//   event.preventDefault(); //리로드 안함.
//   const formData = new FormData(event.target);

//   const title = formData.get("title");
//   console.log(title);
// }
