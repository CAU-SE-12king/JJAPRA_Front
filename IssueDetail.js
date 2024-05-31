const id = "test1";
const password = "test1";
const baseURL = "https://jjapra.r-e.kr";
const token = localStorage.getItem("TOKEN");

const urlParams = new URLSearchParams(window.location.search);
const issueId = urlParams.get("issueId");
const projectId = urlParams.get("projectId");
const userRole = urlParams.get("role");

const commentFormElement = document.getElementById("commentForm");
const statusElement = document.getElementById("status");
const assigneeSelector = document.getElementById("assigneeSelector");

commentFormElement.addEventListener("submit", submitComment);

const getData = async () => {
  // await login();
  console.log(token);
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
      const fixerElement = document.getElementById("fixer");
      const writerElement = document.getElementById("writer");
      const reportedDateElement = document.getElementById("reportedDate");
      const commentsList = document.getElementById("commentsList");

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
      issueTitleElement.innerText = `${response.issue.title}`;

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
      priorityElement.innerText = response.issue.priority;

      //state에 따라 다른 css 클래스 적용
      statusElement.innerText = response.issue.status;
      issueDetailElement.innerText = response.issue.description;
      assigneeElement.innerText = response.issue.assignee;

      writerElement.innerText = response.issue.writer;
      const [year, month, day, hour, minute, second, nanosecond] =
        response.issue.createdAt;
      const date = new Date(year, month - 1, day, hour, minute, second);
      const formattedDate = date.toLocaleString();
      reportedDateElement.innerText = formattedDate;

      if (response.assignee == null) {
        assigneeElement.innerText = "할당 전";
      } else {
        assigneeElement.innerText = response.assignee;
      }

      if (response.fixer == null) {
        fixerElement.innerText = "할당 전";
      } else {
        fixerElement.innerText = response.fixer;
      }

      response.issue.comments.forEach((comment) => {
        console.log(comment);
        const listItem = document.createElement("li");
        const [year, month, day, hour, minute, second, nanosecond] =
          comment.createdAt;
        const formattedDate = date.toLocaleString();
        listItem.textContent = `${comment.writerId} (${formattedDate}): ${comment.content}`;
        commentsList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//key를 바탕으로 value값으로 변경.
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
      console.log(error);
      alert("오류로 인해 저장되지 않았습니다.");
      return false;
    });
  return true;
};

//asignee 할당 함수
const assign = (role, id) => {
  if (id == "") {
    alert("유효한 계정을 선택하세요");
    return false;
  }
  fetch(baseURL + "/issues/" + issueId + "/members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      id: id,
      role: role,
    }),
  }).then((response) => {
    console.log(response.json());
    return true;
  });
};

//Dev인 사용자만 체크박스 option으로 설정하는 함수
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

//
const changeElementsbyRole = (userRole) => {
  switch (userRole) {
    case "PL":
      //new나 resolved일때만 assignee 할당가능.
      if (
        statusElement.innerText != "NEW" ||
        statusElement.innerText != "FIXED"
      ) {
        //assigneeSelector의 option을 현재 프로젝트의 dev로 채움

        const assigneeCard = document.getElementById("assigneeCard");
        const assignBtn = document.createElement("button");
        assignBtn.innerText = "할당";
        assignBtn.onclick = () => {
          const assigneeSelector = document.getElementById("assigneeSelector");
          //post 요청
          if (
            // assign("assignee", assigneeSelector.value) &&
            requestChangeIssue("status", "ASSIGNED")
          ) {
            //post 요청이 성공한다면 새로고침
            location.reload();
          }
        };
        assigneeCard.appendChild(assignBtn);
      }

      break;

    default:
      break;
  }
};

async function submitComment(event) {
  event.preventDefault(); // 폼의 기본 제출 동작을 막습니다.

  const content = document.getElementById("commentContent").value;

  try {
    const response = await fetch(`${baseURL}/issues/${issueId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ content: content }),
    });

    // if (response.status !== 200) {
    //   console.log(response);
    //   alert("오류로 인해 저장되지 않았습니다");
    //   return;
    // }

    const data = await response.json();
    console.log("응답 데이터:", data);

    // 코멘트를 화면에 표시합니다.
    addCommentToList(data);

    // 텍스트 영역을 초기화합니다.
    document.getElementById("commentContent").value = "";
  } catch (error) {
    console.error("Fetch error:", error);
    alert("오류로 인해 저장되지 않았습니다.");
  }
}
function addCommentToList(comment) {
  const commentsList = document.getElementById("commentsList");
  const listItem = document.createElement("li");
  listItem.textContent = comment.content; // 서버에서 받은 데이터의 content를 사용합니다.
  commentsList.appendChild(listItem);
}

changeElementsbyRole(userRole);
setOptions();
getData();
