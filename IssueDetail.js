// import axios from "axios";
const id = "test1";
const password = "test1";
const baseURL = "https://jjapra.r-e.kr";

const urlParams = new URLSearchParams(window.location.search);
const issueId = urlParams.get("issueId");
const projectId = urlParams.get("projectId");

// const login = () => {
//   axios
//     .post(
//       baseURL + "/login",
//       {
//         id: id,
//         password: password,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     )
//     .then((response) => {
//       console.log(response.json());
//       if (response.status == 200) {
//         //  window.location.href="./ProjectList.html"
//       } else {
//         alert("세션이 만료되어 로그인화면으로 돌아갑니다.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// };

const getData = async () => {
  // await login();
  const token = localStorage.getItem("TOKEN");
  console.log(token);
  fetch(baseURL + "/issues/details/" + issueId, {
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
      if (response.status == 400) {
        const detailSectionElement = document.getElementById("detailSection");
        const children = detailSectionElement.children;
        for (let i = 0; i < children.length; i++) {
          children[i].style.display = "none";
        }
      }
      const issueTitleElement = document.getElementById("issueTitle");
      const priorityElement = document.getElementById("priority");
      const stateElement = document.getElementById("state");
      const issueDetailElement = document.getElementById("description");

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
      issueTitleElement.innerHTML = `${response.title}`;

      priorityElement.classList.add("priority-middle");
      priorityElement.innerText = response.priority;

      stateElement.innerText = response.state;
      issueDetailElement.innerText = response.description;
    })
    .catch((error) => {
      console.log(error);
    });
};

getData();
