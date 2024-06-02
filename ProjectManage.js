const createIssuebtnElements =
  document.getElementsByClassName("createIssuebtn");
const formElement = document.querySelector("form");

//suzzang
const assignedIssueBtnElement = document.getElementById("assignedIssueBtn");
const fixedIssueBtnElement = document.getElementById("fixedIssueBtn");

const cancelButtons = document.querySelectorAll(".modal #cancel-config-btn");

formElement.addEventListener("submit", saveIssue);
formElement.addEventListener("reset", closemodal);

cancelButtons.forEach(button => {
  button.addEventListener("click", closeModal);
});

// const projectID = 1;
const projectId = new URLSearchParams(window.location.search).get("projectId");


const id = "suzzang";
const password = "1234";
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

let local = "./test.json";
const getData = async () => {
  fetch(baseURL + "/projects/" + projectId + "/issues", {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("TOKEN"),
  },
})
    // 가져온 데이터를 JSON 형식으로 변환
    .then((response) => response.json())
    // 변환된 JSON 데이터를 콘솔에 출력
    .then((response) => {
      console.log("< 이 프로젝트의 issue들 >");
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
        aElement.innerHTML = `${data.issue.title}`;

        switch (data.issue.status) {
          case "NEW":
            newIssuesSectionElement.children[1].appendChild(liElement);
            break;
          case "ASSIGNED":
            assignedIssuesSectionElement.children[1].appendChild(liElement);
            break;
          case "RESOLVED":
            resolvedIssuesSectionElement.children[1].appendChild(liElement);
            break;
          case "FIXED":
            fixedIssuesSectionElement.children[1].appendChild(liElement);
            break;
          case "CLOSED":
            closedIssuesSectionElement.children[1].appendChild(liElement);
            break;
          default:
            //진행상태가 없는거? 오류
            break;
        }

        // Assigned Issue Modal
          //자신에게 assigned된 이슈만 보여주기
          if(data.assignee != localStorage.getItem("username")) {
            return;
          }

        const issueBody = document.getElementById("issueBody");

        const issueRow = document.createElement("div");
        issueRow.classList.add("issueRow");

        const issueDate = document.createElement("div");
        issueDate.classList.add("issueTableCell");
        issueDate.innerHTML = data.issue.createdAt;
        const issueTitle = document.createElement("div");
        issueTitle.classList.add("issueTableCell");
        issueTitle.innerHTML = data.issue.title;
        const issuePriority = document.createElement("div");
        issuePriority.classList.add("issueTableCell");
        issuePriority.innerHTML = data.issue.priority;
        const issueStatus = document.createElement("div");
        issueStatus.classList.add("issueTableCell");
        issueStatus.innerHTML = data.issue.status;
        const issueWriter = document.createElement("div");
        issueWriter.classList.add("issueTableCell");
        issueWriter.innerHTML = data.issue.writer;

        issueRow.appendChild(issueDate);
        issueRow.appendChild(issueTitle);
        issueRow.appendChild(issuePriority);
        issueRow.appendChild(issueStatus);
        issueRow.appendChild(issueWriter);

        issueBody.appendChild(issueRow);
      });
    });
};

// getData(); 이거 왜 있는거임? ㅡㅡ

[...createIssuebtnElements].forEach(function (element) {
  element.addEventListener("click", showmodal);
});
//suzzang
  assignedIssueBtnElement.addEventListener("click", showAssignedIssueModal);

  fixedIssueBtnElement.addEventListener("click", showFixedIssueModal);


function showmodal(event) {
  const modalElement = document.getElementById("config-overlay");
  modalElement.style.display = "block";
}

function closemodal() {
  const modalElement = document.getElementById("config-overlay");
  modalElement.style.display = "none";
}

//suzzang
function showAssignedIssueModal(event) {
  const modalElement = document.getElementById("assigned-overlay");
  modalElement.style.display = "block";
}
function closeAssignedIssueModal() {
  const modalElement = document.getElementById("assigned-overlay");
  modalElement.style.display = "none";
}
function showFixedIssueModal(event) {
  const modalElement = document.getElementById("fixed-overlay");
  modalElement.style.display = "block";
}
function closeFixedIssueModal() {
  const modalElement = document.getElementById("fixed-overlay");
  modalElement.style.display = "none";
}

function closeModal(event) {
  const modalElement = event.target.closest(".modal");
  if (modalElement) {
    modalElement.style.display = "none";
  }
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


//project detail 정보 가져오기 test
function getProjectDetail() {
  fetch(baseURL + "/projects/" + projectId
    , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function deleteProject() {
  console.log(projectId);
  console.log(localStorage.getItem("TOKEN"));
  axios.delete(baseURL + "/projects/" + projectId, 
  {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), //근데 이거 다른 계정으로 로그인하면 토큰 덮어씌워지나..? 흠...
      },
  })
  .then(response => {
      if (response.status === 200) {
          console.log(response.data);
          alert("Project deleted successfully.");
          window.location.href="./ProjectList.html";
      } else {
          throw new Error('Unexpected response status: ' + response.status);
      }
  })

}