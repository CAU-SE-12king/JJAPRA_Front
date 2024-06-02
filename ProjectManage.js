const createIssuebtnElement = document.getElementById("createIssuebtn");
const formElement = document.querySelector("form");
const token = localStorage.getItem("TOKEN");

const showErrorMsg = () => {
  alert("권한이 없습니다.");
};

createIssuebtnElement.addEventListener("click", showErrorMsg);

formElement.addEventListener("submit", saveIssue);
formElement.addEventListener("reset", closemodal);

const decodedToken = parseJWT(token);
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("projectId");
const userRole = decodedToken.payload.role;
const userName = decodedToken.payload.userName;

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
        window.location.href = "./login.html";
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
          `./issueDetail.html?issueId=${data.issue.issueId}&projectId=${data.issue.projectId}&role=${userRole}`
        );
        liElement.setAttribute("id", `${data.issue.issueId}`);
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
            //진행상태가 없는거? 오류ß
            break;
        }
      });
    });
};

const setElementsbyRole = (userRole) => {
  switch (userRole) {
    //tester만 이슈를 생성 기능 가능.
    case "TESTER":
    case "ADMIN":
      createIssuebtnElement.removeEventListener("click", showErrorMsg);
      createIssuebtnElement.addEventListener("click", showmodal);
      break;
    default:
      break;
  }
  //tester 만 이슈를 생성하도록 설정

  //dev,tester만 코멘트를 달 수 있도록 설정

  //해당 이슈에 assined 된 developer 만 이슈 진행상태를 resolved->fixed가능
};

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

  //이슈를 DB에 저장하는 함수
  fetch(baseURL + "/projects/" + projectId + "/issues", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      title: formData.get("title"),
      description: formData.get("description"),
      priority: parseInt(formData.get("priority")),
    }),
  })
    .then((response) => {
      console.log(response.status);
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
  // const descricption = formData.get("description");
  // const priority = formData.get("priority");

  const newIssueElement = document.createElement("li");
  newIssueElement.append(title);

  const newBoardElement = document.getElementById("new");
  newBoardElement.children[1].appendChild(newIssueElement);

  const modalElement = document.getElementById("config-overlay");
  modalElement.style.display = "none";
  modalElement.children[1].reset();
}
setElementsbyRole(userRole);
getData();

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
