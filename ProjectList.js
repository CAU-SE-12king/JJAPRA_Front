const baseURL = 'https://jjapra.r-e.kr';

//로그인 되어있지 않으면 초록 projectCreate 버튼 안 되게 경고하는 함수
function openProjectCreate() {
    const username = localStorage.getItem('username');
    if (username) {
    } else {
        alert("Please Log in first"); // 로그인하라는 메시지
        return;
    }
    //admin 계정만 projectCreate 페이지로 이동 가능하게 하는 코드
    if(username === 'admin'){ 
        window.location.href = "./ProjectCreate.html";
    }
    else{
        alert("Only admin can create a project.");
    }
}

//DB에서 프로젝트 목록을 가져와서 출력하는 함수
const getProjects = () => { //axios로 변경
    return new Promise((resolve, reject) => {
            //일단 로그인 했는지부터 확인   
            const username = localStorage.getItem('username');
            if (username) {

            } 
            else{
                console.log("Please log in first.");
                const message = document.createElement('div');
                message.classList.add('loginPlzMessage');
                message.innerHTML = "Please log in first.";
                projectList.appendChild(message);
            }    

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
                a.setAttribute('href', `./ProjectManage.html?role=${data.role}&projectId=${data.project.id}`);

                // 랜덤 색상 생성 및 적용
                const randomColor = getRandomColor();
                a.style.borderLeftColor = randomColor;

                const projectTitle = document.createElement('div');
                projectTitle.classList.add('projectTitle');
                projectTitle.innerHTML = `${data.project.title}`;

                const projectDescription = document.createElement('div');
                projectDescription.classList.add('projectDescription');
                projectDescription.innerHTML = `${data.project.description}`;

                const allocateRoleBtn = document.createElement('a');
                const allocateRoleBtnIcon = document.createElement('i');
                allocateRoleBtn.appendChild(allocateRoleBtnIcon);
                allocateRoleBtn.classList.add('allocateRoleBtn');
                allocateRoleBtnIcon.classList.add('fa-solid');
                allocateRoleBtnIcon.classList.add('fa-person-circle-plus');
                allocateRoleBtn.setAttribute('href', `./allocateRole.html?id=${data.id}`);

                a.appendChild(projectTitle);
                a.appendChild(projectDescription);
                a.appendChild(allocateRoleBtn);
                projectList.appendChild(a);
            });
            resolve();
        })
        .catch(error => {
            console.error('Error:', error);
            reject(error);
        });
    });
}


function toggleAllocateRoleBtn() {
    const username = localStorage.getItem('username');
    const allocateRoleBtns = document.getElementsByClassName('allocateRoleBtn');
    for (let i = 0; i < allocateRoleBtns.length; i++) {
        if (username === 'admin') {
            allocateRoleBtns[i].style.display = 'flex';
        } else {
            allocateRoleBtns[i].style.display = 'none';
        }
    }
}


function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}


// 여기부터 default 코드 ///

// localStorage에서 사용자 이름을 가져와서 프로필에 표시하는 함수 추가
function displayUsername() {
    console.log("displayUsername() called");
    const username = localStorage.getItem('username'); // localStorage에서 사용자 이름 가져오기
    if (username) {
        document.querySelector('#profile span').textContent = username; // 사용자 이름을 페이지에 표시
    }
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
        loginBtn.style.display = 'flex'; // 로그인 버튼 보이기
        logoutBtn.style.display = 'inline-block';   // 로그아웃 버튼 숨기기
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


// 프로필 누르면 해당 계정에만 해당하는 issue 페이지로 이동
function openUserIssues() {
    // window.location.href = "./UserIssues.html";
    const username = localStorage.getItem('username');
    if (username) {
        window.location.href = "./UserIssues.html";
    } else {
        alert("Please Log in first"); // 로그인하라는 메시지
    }
}
