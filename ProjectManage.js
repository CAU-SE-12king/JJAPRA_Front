const createIssuebtnElement = document.getElementById("createIssuebtn");
const formElement = document.querySelector("form");

const showErrorMsg = () => {
  alert("권한이 없습니다.");
};

createIssuebtnElement.addEventListener("click", showErrorMsg);

formElement.addEventListener("submit", saveIssue);
formElement.addEventListener("reset", closemodal);

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("projectId");
const userRole = urlParams.get("role");

let local = "./test.json";

// fetch(`https://jjapra.r-e.kr/projects/${projectID}/issues`, {
//   credentials: "include", // 쿠키포함
// })
//   .then((response) => {
//     response.json();
//   })
//   .then((data) => {
//     console.log(data);
//     if (data.length == 0) {
//     } else {
//     }
//   })
//   .catch((error) => {
//     console.log(error);
//     //대체
//   });

const id = "admin";
const password = "admin";
const baseURL = "https://jjapra.r-e.kr";

const login = async () => {
  await fetch(baseURL + "/login", {
    method: "POST",
    credentials: "include", // 쿠키를 포함하도록 설정
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id: id,
      password: password,
    }),
  })
    .then(async (response) => {
      if (response.status == 200) {
        //  window.location.href="./ProjectList.html"
      } else {
        alert("토큰이 만료되어 로그인화면으로 돌아갑니다.");
      }
      const data = await response.json();
      const TOKEN = data.token; // 응답에서 token 값 가져오기
      localStorage.setItem("TOKEN", TOKEN); // 사용자 이름 localStorage에 저장
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const getData = async () => {
  await login();
  const token = localStorage.getItem("TOKEN");
  fetch(baseURL + "/projects/" + projectId + "/issues", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    // 가져온 데이터를 JSON 형식으로 변환
    .then((response) => response.json())
    // 변환된 JSON 데이터를 콘솔에 출력
    .then((response) => {
      console.log(response);

      const newIssuesSectionElement = document.getElementById("new");
      const assignedIssuesSectionElement = document.getElementById("assigned");
      const resolvedIssuesSectionElement = document.getElementById("resolved");
      const fixedIssuesSectionElement = document.getElementById("fixed");
      const closedIssuesSectionElement = document.getElementById("closed");

      response.map((data) => {
        //data 배열들을 돌면서 요소들 출력
        //wrapper 생성
        const liElement = document.createElement("li");
        const aElement = document.createElement("a");
        liElement.appendChild(aElement);
        aElement.setAttribute(
          "href",
          `./issueDetail.html?issueId=${data.issueId}&projectId=${data.projectId}`
        );
        liElement.setAttribute("id", `${data.issueId}`);
        aElement.innerHTML = `${data.title}`;

        switch (data.status) {
          case "NEW":
            newIssuesSectionElement.children[1].appendChild(liElement);
            break;
          case "assigned":
            assignedIssuesSectionElement.children[1].appendChild(liElement);
            break;
          case "resolved":
            resolvedIssuesSectionElement.children[1].appendChild(liElement);
            break;
          case "fixed":
            fixedIssuesSectionElement.children[1].appendChild(liElement);
            break;
          case "closed":
            closedIssuesSectionElement.children[1].appendChild(liElement);
            break;
          default:
            //진행상태가 없는거? 오류ß
            break;
        }
      });
    });
};

const setElementsbyRole = (userRole) => {
  switch (userRole) {
    //tester만 이슈를 생성 기능 가능.
    case "tester":
      createIssuebtnElement.removeEventListener("click", showErrorMsg);
      createIssuebtnElement.addEventListener("click", showmodal);
      break;
    //pl만 assinee를 할당 가능.
    default:
      break;
  }
  //tester 만 이슈를 생성하도록 설정

  //dev,tester만 코멘트를 달 수 있도록 설정

  //해당 이슈에 assined 된 developer 만 이슈 진행상태를 resolved->fixed가능
};

setElementsbyRole(userRole);
getData();

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
  const formData = new FormData(this);
  const token = localStorage.getItem("TOKEN");
  console.log(token);

  //이슈를 DB에 저장하는 함수
  fetch(baseURL + "/projects/" + projectId + "/issues", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      title: formData.get("title"),
      descricption: formData.get("description"),
      priority: parseInt(formData.get("priority")),
    }),
  })
    .then((response) => {
      if (response.status == 400) {
        alert("서버측 오류로 이슈 저장에 실패했습니다");
        return;
      }
    })
    .catch((error) => {
      console.log(error);
      alert("알수없는 오류로 이슈 저장에 실패했습니다.");
      return;
    });

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
