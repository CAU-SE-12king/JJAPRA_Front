const baseURL = "https://jjapra.r-e.kr";


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

  axios.post(baseURL + "projects", {
    title: title,
    description: description
}, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), //근데 이거 다른 계정으로 로그인하면 토큰 덮어씌워지나..? 흠...
    },
})
.then(response => {
    if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        alert("Project created successfully.");
        window.location.href="./ProjectList.html";
    } else {
        throw new Error('Unexpected response status: ' + response.status);
    }
})
.catch(error => {
    if (error.response) {
        // 서버가 상태 코드를 반환했지만 2xx 범위에 있지 않은 경우
        console.log('Error response:', error.response);
        console.log('Response data:', error.response.data);
        alert(`Failed to create project: ${error.response.status} ${error.response.data.error}`);
    } else if (error.request) {
        // 요청이 만들어졌지만 응답을 받지 못한 경우
        console.error('No response:', error.request);
        alert("No response from the server.");
    } else {
        // 요청 설정 중에 문제가 발생한 경우
        console.error('Error:', error.message);
        alert("Error occurred: " + error.message);
    }
});

}
