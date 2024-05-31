const id = "test1";
const password = "test1";
const baseURL = "https://jjapra.r-e.kr";
const token = localStorage.getItem("TOKEN");

const urlParams = new URLSearchParams(window.location.search);
const issueId = urlParams.get("issueId");
const projectId = urlParams.get("projectId");
const userRole = urlParams.get("role");

const stateElement = document.getElementById("state");
const assigneeSelector = document.getElementById("assigneeSelector");

let members = {};

const getData = async () => {
  // await login();
  console.log(issueId);
  fetch(baseURL + "/issues/" + issueId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    // 가져온 데이터를 JSON 형식으로 변환
    .then((response) => response.json())
    .then((response) => {
      // if (response.status != 200) {
      //   const detailSectionElement = document.getElementById("detailSection");
      //   const children = detailSectionElement.children;
      //   for (let i = 0; i < children.length; i++) {
      //     children[i].style.display = "none";
      //   }
      // }
      const issueTitleElement = document.getElementById("issueTitle");
      const priorityElement = document.getElementById("priority");
      const issueDetailElement = document.getElementById("description");
      const assigneeElement = document.getElementById("assignee");
      const writerElement = document.getElementById("assignee");
      const reportedDateElement = document.getElementById("assignee");

      //data 배열들을 돌면서 요소들 출력
      //wrapper 생성
      // const liElement = document.createElement("li");
      // const aElement = document.createElement("a");
      // liElement.appendChild(aElement);
      // aElement.setAttribute(
      //   "href",
      //   `./issueDetail.html/?issueId=${data.issueId}&projectId=${data.projectId}`
      // );
      // liElement.setAttribute("id", `${data.issueId}`);
      issueTitleElement.innerText = `${response.title}`;

      //priority에 따라 다른 css 클래스 적용
      // switch (response.priority) {
      //   //low
      //   case 1:
      //     priorityElement.classList.add("priority-low");
      //     break;
      //   case 2:
      //     priorityElement.classList.add("priority-middle");
      //   case 3:
      //     priorityElement.classList.add("priority-high");
      //     cas
      //   default:
      //     priorityElement.classList.add("priority-high");
      //     break;
      // }
      priorityElement.classList.add("priority-middle");
      priorityElement.innerText = response.priority;

      //state에 따라 다른 css 클래스 적용
      stateElement.innerText = response.state;
      issueDetailElement.innerText = response.description;
      assigneeElement.innerText = response.assignee;

      writerElement.innerText = response.writer;
      const [year, month, day, hour, minute, second, nanosecond] =
        response.createdAt;
      const date = new Date(year, month - 1, day, hour, minute, second);
      const formattedDate = date.toLocaleString();
      reportedDateElement.innerText = formattedDate;
    })
    .catch((error) => {
      console.log(error);
    });
};

const requestChangeIssue = (key, value) => {
  console.log("이슈 변경");
  fetch(baseURL + "/issues/" + issueId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      [key]: value,
    }),
  })
    .then((response) => {
      if (response.status != 200) {
        alert("오류로 인해 저장되지 않았습니다");
        return false;
      }
      return true;
    })
    .catch((error) => {
      alert("오류로 인해 저장되지 않았습니다.");
      return false;
    });
  console.log("fetch 됨?");
};

const assignDev = (key, value) => {
  fetch(baseURL + "/issues/" + issueId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      [key]: value,
    }),
  }).then((response) => {
    if (response.status != 200) {
      alert("오류로 인해 저장되지 않았습니다");
      return false;
    }
    return true;
  });
};

const setOptions = () => {
  fetch(baseURL + "/projects/" + projectId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      response.members.forEach((element) => {
        //dev 인경우에만 선택 가능
        if (element.value != "dev") {
          const optionElement = document.createElement("option");
          optionElement.innerText = element.key;
          optionElement.value = element.key;
          assigneeSelector.appendChild(optionElement);
        }
      });
      // console.log(members);
    });
};

const changeElementsbyRole = (userRole) => {
  switch (userRole) {
    case "PL":
      //new나 resolved일때만 assignee 할당가능.
      if (
        stateElement.innerText != "new" ||
        stateElement.innerText != "fixed"
      ) {
        //assigneeSelector의 option을 현재 프로젝트의 dev로 채움

        const assigneeCard = document.getElementById("assigneeCard");
        const assignBtn = document.createElement("button");
        assignBtn.innerText = "할당";
        assignBtn.onclick = () => {
          const assigneeSelector = document.getElementById("assigneeSelector");
          //post 요청
          if (
            assignDev("assigneee", assigneeSelector.value) &&
            requestChangeIssue("status", "resolved")
          ) {
            assigneeCard.removeChild(assignBtn);
          }
          //post 요청이 성공한다면 할당버튼 삭제
        };
        assigneeCard.appendChild(assignBtn);
      }

      break;

    default:
      break;
  }
};

changeElementsbyRole(userRole);
setOptions();
getData();
