const baseURL = 'https://jjapra.r-e.kr';
// const getData = () => {
//     fetch(baseURL+"/projects")
//             // 가져온 데이터를 JSON 형식으로 변환
//             .then(response => response.json())
//             // 변환된 JSON 데이터를 콘솔에 출력
//             .then((response)=> {
//             console.log(response);
//             const projectList = document.getElementById('projectList');

//             response.map((data)=>{ //data 배열들을 돌면서 요소들 출력
//                 //wrapper 생성
//                 const a = document.createElement('a');
//                 a.classList.add("project");
//                 a.setAttribute('href', "./ProjectManage.html");

//                 // 랜덤 색상 생성 및 적용
//                 const randomColor = getRandomColor();
//                 a.style.borderLeftColor = randomColor;



//                 const projectTitle = document.createElement('div');
//                 projectTitle.classList.add('projectTitle');
//                 projectTitle.innerHTML = `${data.title}`;

//                 const projectDescription = document.createElement('div');
//                 projectDescription.classList.add('projectDescription');
//                 projectDescription.innerHTML = `${data.description}`;

//                 a.appendChild(projectTitle);
//                 a.appendChild(projectDescription);
//                 projectList.appendChild(a);
//             })
            
//         })
            
// }

const getData = () => { //axios로 변경
    axios.get(baseURL + "/projects", {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), //근데 이거 다른 계정으로 로그인하면 토큰 덮어씌워지나..? 흠...
        }
    })
        .then(response => {
            console.log(response.data);
            const projectList = document.getElementById('projectList');

            response.data.forEach(data => { //data 배열들을 돌면서 요소들 출력
                //wrapper 생성
                const a = document.createElement('a');
                a.classList.add("project");
                a.setAttribute('href', "./ProjectManage.html");

                // 랜덤 색상 생성 및 적용
                const randomColor = getRandomColor();
                a.style.borderLeftColor = randomColor;

                const projectTitle = document.createElement('div');
                projectTitle.classList.add('projectTitle');
                projectTitle.innerHTML = `${data.title}`;

                const projectDescription = document.createElement('div');
                projectDescription.classList.add('projectDescription');
                projectDescription.innerHTML = `${data.description}`;

                a.appendChild(projectTitle);
                a.appendChild(projectDescription);
                projectList.appendChild(a);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// localStorage에서 사용자 이름을 가져와서 프로필에 표시하는 함수 추가
function displayUsername() {
    console.log("displayUsername() called");
    const username = localStorage.getItem('username'); // localStorage에서 사용자 이름 가져오기
    console.log(username);
    if (username) {
        document.querySelector('#profile span').textContent = username; // 사용자 이름을 페이지에 표시
    }
}

function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function logOut() {
    const confirmed = confirm("Are you sure you want to log out?");
    if (confirmed) {
        localStorage.removeItem('username'); // 사용자 이름 삭제
        localStorage.removeItem('TOKEN'); // 토큰 삭제!!
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
    const username = localStorage.getItem('username');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (username) {
        // 사용자가 로그인한 경우
        loginBtn.style.display = 'none';   // 로그인 버튼 숨기기
        logoutBtn.style.display = 'inline-block'; // 로그아웃 버튼 보이기
    } else {
        // 사용자가 로그인하지 않은 경우
        loginBtn.style.display = 'inline-block'; // 로그인 버튼 보이기
        logoutBtn.style.display = 'none';   // 로그아웃 버튼 숨기기
    }
}



//sidebar test
document.getElementById('toggleSidebarBtn').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('mainContainer');
    if (sidebar.style.width === '170px') {
        sidebar.style.width = '0';
        content.style.marginLeft = '100px';
    } else {
        sidebar.style.width = '170px';
        content.style.marginLeft = '200px';
    }
});

// // 페이지 로드 시 사용자 이름 표시
// window.onload = function() {
//     console.log("onload");
//     displayUsername();
//     // getData();
// };