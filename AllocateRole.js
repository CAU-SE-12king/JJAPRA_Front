const baseURL = 'https://jjapra.r-e.kr';
const projectId = new URLSearchParams(window.location.search).get('id');

//쿼리스트링으로 받아온 프로젝트 id를 토대로 프로트트 이름 가져오는 함수
function getProjectName() {
    axios.get(baseURL + "/projects/" + projectId, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), //근데 이거 다른 계정으로 로그인하면 토큰 덮어씌워지나..? 흠...
        }
    })
    .then(response => {
        console.log(response.data);

        //프로젝트 이름을 가져와서 출력
        const projectTitle = response.data.project.title;
        const selectedProject = document.getElementById('selectedProject');
        selectedProject.innerHTML = projectTitle;
    })
    .catch(error => {
        console.error(error);
    });
}

//멤버들 모두 불러와서 select에 추가하는 함수
function getMembers() {
    axios.get(baseURL + "/members", {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), //근데 이거 다른 계정으로 로그인하면 토큰 덮어씌워지나..? 흠...
        }
    })
    .then(response => {
        console.log(response.data);

        //멤버들을 select에 추가
        const members = response.data;
        const selectMember = document.getElementById('selectedMember');
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.id;
            selectMember.appendChild(option);
        });
    })
}

//프로젝트에 역할 설정해서 요청 보내는 함수(멤버 할당 안 할 수도 있어야함!! option값이 없게)
function postRole() {
    const userID = document.getElementById('selectedMember').value;
    const role = document.getElementById('selectedRole').value;
    console.log(userID, role);
    axios.post(baseURL + "/projects/" + projectId + "/members", {
        id: userID,
        role: role
    }, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), //근데 이거 다른 계정으로 로그인하면 토큰 덮어씌워지나..? 흠...
        }
    })
    .then(response => {
        alert("Role allocated successfully.");
        //이거 끝나면 어디로 가게 할지??//
        // window.location.href="./ProjectManage.html?id=" + projectId; 
        window.location.href="./ProjectList.html";
    })
}

// 여기부터 default 코드 //
function displayUsername() {
    console.log("displayUsername() called");
    const username = localStorage.getItem('username'); // localStorage에서 사용자 이름 가져오기
    console.log(username);
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
