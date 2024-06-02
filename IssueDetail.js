
const baseURL = "https://jjapra.r-e.kr";
const token = localStorage.getItem("TOKEN");
const decodedToken = parseJWT(token);

const urlParams = new URLSearchParams(window.location.search);
const issueId = urlParams.get("issueId");
const projectId = urlParams.get("projectId");
const userRole = decodedToken.payload.role;
const userName = decodedToken.payload.userName;

const assigneeElement = document.getElementById("assignee");

const commentFormElement = document.getElementById("commentForm");
const statusElement = document.getElementById("status");
const commentsList = document.getElementById("commentsList");

commentFormElement.addEventListener("submit", submitComment);

function parseJWT(token) {
  // Base64Url 인코딩에서 Base64 인코딩으로 변환하는 함수
  function base64UrlDecode(str) {
    return decodeURIComponent(
      atob(str.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT token");
  }

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  const signature = parts[2]; // 서명은 디코딩할 필요가 없음

  return {
    header,
    payload,
    signature,
  };
}

const getData = () => {
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
      const fixedElement = document.getElementById("isFixed");
      const resolvedElement = document.getElementById("isResolved");
      const writerElement = document.getElementById("writer");
      const reportedDateElement = document.getElementById("reportedDate");

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
      assignee = response.issue.assignee;
      assigneeElement.innerText = assignee;

      writerElement.innerText = response.issue.writer;
      const [year, month, day, hour, minute, second, nanosecond] =
        response.issue.createdAt;
      const date = new Date(year, month - 1, day, hour, minute, second);
      const formattedDate = date.toLocaleString();
      reportedDateElement.innerText = formattedDate;

      if (response.assignee) {
        assigneeElement.innerText = response.assignee;
      } else {
        assigneeElement.innerText = "할당 전";
      }
      if (response.issue.status == "RESOLVED") {
        resolvedElement.innerText = "완료";
        fixedElement.innerText = "완료";
      } else {
        resolvedElement.innerText = "미완료";
        if (response.issue.status == "FIXED") {
          fixedElement.innerText = "완료";
        } else {
          fixedElement.innerText = "미완료";
        }
      }

      response.issue.comments.forEach((comment) => {
        const listItem = document.createElement("li");
        const [year, month, day, hour, minute, second, nanosecond] =
          comment.createdAt;
        const date = new Date(year, month - 1, day, hour, minute, second);
        const formattedDate = date.toLocaleString();
        listItem.textContent = `${comment.writerId} (${formattedDate}): ${comment.content}`;
        commentsList.appendChild(listItem);
      });
      changeElementsbyRole();
    })
    .catch((error) => {
      console.log(error);
    });
};

//key를 바탕으로 value값으로 변경.
const requestChangeIssue = async (key, value) => {
  console.log("이슈 변경");
  await fetch(baseURL + "/issues/" + issueId, {
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
      if (!response.ok) {
        alert("오류로 인해 저장되지 않았습니다");
        return false;
      }
      return response.json().then((data) => {
        console.log(data);
        return true; // 성공 시 true 반환
      });
    })
    .catch((error) => {
      alert(error);
    });
};

//asignee 할당 함수
const assign = (id, role) => {
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
  })
    .then((response) => {
      if (!response.ok) {
        return false;
      }
      return response.json(); // JSON 응답을 반환하여 다음 then으로 연결
    })
    .then((data) => {
      console.log(data);
      return true; // 성공 시 true 반환
    })
    .catch((error) => {
      console.error(error);
      return false; // 에러 시 false 반환
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
        //dev 인경우에만 option에 추가
        if (element.value == "DEV") {
          const optionElement = document.createElement("option");
          optionElement.innerText = element.key;
          optionElement.value = element.key;

          const assigneeSelector = document.getElementById("assigneeSelector");
          assigneeSelector.appendChild(optionElement);
        }
      });
      // console.log(members);
    });
};

const setPrioriyOptions = (selector, priorities) => {
  priorities.forEach((element) => {
    const option = document.createElement("option");
    option.innerText = element;
    option.value = element;
    selector.appendChild(option);
  });
};

//
const changeElementsbyRole = async () => {
  //pl은 priority 변경 가능
  if (userRole == "PL" || userRole == "ADMIN") {
    const prioritySection = document.getElementById("prioritySection");
    const prioritySelector = document.createElement("select");
    prioritySelector.id = "prioritySelector";

    const defaultOption = document.createElement("option");
    defaultOption.innerText = "Priority 목록";
    defaultOption.selected = true;
    defaultOption.value = "";

    prioritySelector.appendChild(defaultOption);
    prioritySection.appendChild(prioritySelector);
    setPrioriyOptions(prioritySelector, [
      "BLOCKER",
      "CRITICAL",
      "MAJOR",
      "MINOR",
      "TRIVIAL",
    ]);
    prioritySelector.onchange = async () => {
      console.log("fds");
      await requestChangeIssue("priority", prioritySelector.value);
      window.location.reload();
    };

    const status = statusElement.innerText;
    //new나 resolved일때만 할당 가능
    if (status == "NEW" || status == "RESOLVED") {
      //assigneeSelector의 option을 현재 프로젝트의 dev로 채움
      const assigneeCard = document.getElementById("assigneeCard");
      const assigneeSelector = document.createElement("select");
      assigneeSelector.id = "assigneeSelector";

      const defaultOption = document.createElement("option");
      defaultOption.innerText = "Dev 목록";
      defaultOption.selected = true;
      defaultOption.value = "";
      await setOptions();

      assigneeSelector.appendChild(defaultOption);
      const assignBtn = document.createElement("button");
      assignBtn.innerText = "할당";
      assignBtn.onclick = async () => {
        await assign(assigneeSelector.value, "ASSIGNEE");
        await requestChangeIssue("status", "ASSIGNED");
        window.location.reload();
      };
      assigneeCard.appendChild(assigneeSelector);
      assigneeCard.appendChild(assignBtn);
      //resolved일 경우 closed로 변환할 수 있어야함
      if (status == "RESOLVED") {
        const detailSection = document.getElementById("detailSection");
        const closedBtn = document.createElement("button");
        closedBtn.innerText = "이슈 Closed";
        detailSection.appendChild(closedBtn);
      }
    }
  }
  if (userRole == "DEV" || userRole == "ADMIN") {
    //해당 issue에 할당된 DEV일경우 ASSINGE->FIXED 가능
    if (assigneeElement.innerText != userName) {
      const fixCard = document.getElementById("fixCard");
      const fixBtn = document.createElement("button");
      fixBtn.innerText = "FIX 처리";
      fixCard.appendChild(fixBtn);
      fixBtn.onclick = async () => {
        await requestChangeIssue("status", "FIXED");
        window.location.reload();
      };
    }
  }
  if (userRole == "TESTER" || userRole == "ADMIN") {
    //해당 issue에 할당된 DEV일경우 ASSINGE->RESOLVED 가능
    const resolvedCard = document.getElementById("resolvedCard");
    const resovledBtn = document.createElement("button");
    resovledBtn.innerText = "Resolved 처리";
    resolvedCard.appendChild(resovledBtn);
    resovledBtn.onclick = async () => {
      await requestChangeIssue("status", "RESOLVED");
      window.location.reload();
    };
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
  const listItem = document.createElement("li");
  const [year, month, day, hour, minute, second, nanosecond] =
    comment.createdAt;
  const date = new Date(year, month - 1, day, hour, minute, second);
  const formattedDate = date.toLocaleString();
  listItem.textContent = `${comment.writerId} (${formattedDate}): ${comment.content}`;
  commentsList.appendChild(listItem);
}
getData();