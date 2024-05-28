const baseURL = 'https://jjapra.r-e.kr';


function getMembers() {
    axios.get(baseURL + "/members", {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), //근데 이거 다른 계정으로 로그인하면 토큰 덮어씌워지나..? 흠...
        }
    })
    .then(response => {
        console.log(response.data);

        const memberList = document.getElementById('memberList');
        response.data.forEach((data, index) => { // 인덱스를 두 번째 매개변수로 받음
            const memberWrapper = document.createElement('div');
            memberWrapper.classList.add('memberWrapper');
            
            const num = document.createElement('div');
            num.classList.add('memberNum');
            num.innerHTML = `< ${index + 1} >`; // 인덱스 출력, 1부터 시작하도록

            const memberId = document.createElement('div');
            memberId.classList.add('memberRow');
            memberId.innerHTML = `ID : ${data.id}`;
            const memberPassword = document.createElement('div');
            memberPassword.classList.add('memberRow');
            memberPassword.innerHTML = `Password : ${data.password}`;
            const memberName = document.createElement('div');
            memberName.classList.add('memberRow');
            memberName.innerHTML = `Name : ${data.name}`;
            const memberEmail = document.createElement('div');
            memberEmail.classList.add('memberRow');
            memberEmail.innerHTML = `Email : ${data.email}`;
            const memberPhone = document.createElement('div');
            memberPhone.classList.add('memberRow');
            memberPhone.innerHTML = `Phone : ${data.phone_num}`;

            memberWrapper.appendChild(num);
            memberWrapper.appendChild(memberId);
            memberWrapper.appendChild(memberPassword);
            memberWrapper.appendChild(memberName);
            memberWrapper.appendChild(memberEmail);
            memberWrapper.appendChild(memberPhone);

            memberList.appendChild(memberWrapper);
        });

    })
    .catch(error => {
        console.error(error);
    });
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

