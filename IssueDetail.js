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
        assigneeElement.innerText = " ❌ ";
      }
      if (response.issue.status == "RESOLVED") {
        resolvedElement.innerText = " ⭕️ ";
        fixedElement.innerText = " ❌ ";
      } else {
        resolvedElement.innerText = " ❌ ";
        if (response.issue.status == "FIXED") {
          fixedElement.innerText = " ⭕️ ";
        } else {
          fixedElement.innerText = " ❌ ";
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
    defaultOption.innerText = "Priority 변경";
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
      assignBtn.classList.add("assignBtn");
      assignBtn.innerText = "assign";
      assignBtn.onclick = async () => {
        try {
          await assign(assigneeSelector.value, "ASSIGNEE");
          await requestChangeIssue("status", "ASSIGNED");
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
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
      fixBtn.classList.add("fixBtn");
      fixBtn.innerText = "fix";
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
    resovledBtn.classList.add("resolvedBtn");
    resovledBtn.innerText = "resolve";
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

// 여기부터 default 코드 ///

// localStorage에서 사용자 이름을 가져와서 프로필에 표시하는 함수 추가
function displayUsername() {
  console.log("displayUsername() called");
  const username = localStorage.getItem("username"); // localStorage에서 사용자 이름 가져오기
  if (username) {
    document.querySelector("#profile span").textContent = username; // 사용자 이름을 페이지에 표시
  }
}

function logOut() {
  const confirmed = confirm("Are you sure you want to log out?");
  if (confirmed) {
    localStorage.removeItem("username"); // 사용자 이름 삭제
    localStorage.removeItem("TOKEN"); // 토큰 삭제!!
    console.log("logout");
    location.href = "./loginpage.html";
  } else {
    console.log("Logout canceled");
  }
}
function logIn() {
  location.href = "./loginpage.html";
}

function toggleLoginLogoutButtons() {
  const username = localStorage.getItem("username");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (username) {
    // 사용자가 로그인한 경우
    loginBtn.style.display = "none"; // 로그인 버튼 숨기기
    logoutBtn.style.display = "inline-block"; // 로그아웃 버튼 보이기
  } else {
    // 사용자가 로그인하지 않은 경우
    loginBtn.style.display = "flex"; // 로그인 버튼 보이기
    logoutBtn.style.display = "inline-block"; // 로그아웃 버튼 숨기기
  }
}

//sidebar test
document
  .getElementById("toggleSidebarBtn")
  .addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("mainContainer");
    if (sidebar.style.width === "170px") {
      sidebar.style.width = "0";
      content.style.marginLeft = "100px";
    } else {
      sidebar.style.width = "170px";
      content.style.marginLeft = "200px";
    }
  });

// 프로필 누르면 해당 계정에만 해당하는 issue 페이지로 이동
function openUserIssues() {
  // window.location.href = "./UserIssues.html";
  const username = localStorage.getItem("username");
  if (username) {
    window.location.href = "./UserIssues.html";
  } else {
    alert("Please Log in first"); // 로그인하라는 메시지
  }
}
