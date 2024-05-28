const baseURL = 'https://jjapra.r-e.kr';

const getUserIssues = () => { //axios로 변경
    axios.get(baseURL + "/issues", {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), 
        }
    })
        .then(response => {
            console.log(response.data);

            //이슈들을 출력
            const issues = response.data;
            const issueTableBody = document.getElementById('issueTableBody');
            issues.forEach(data => {
                //issueTableRow 생성
                const issueTableRow = document.createElement('div');
                issueTableRow.classList.add("issueTableRow");

                const issueId = document.createElement('div');
                issueId.classList.add("issueTableCell");
                issueId.classList.add("issueId");
                issueId.innerHTML = `${data.issueId}`;

                const projectId = document.createElement('div');
                projectId.classList.add("issueTableCell");
                projectId.classList.add("projectId");
                projectId.innerHTML = `${data.projectId}`;

                const issueTitle = document.createElement('div');
                issueTitle.classList.add("issueTableCell");
                issueTitle.innerHTML = `${data.title}`;

                const issueDescription = document.createElement('div');
                issueDescription.classList.add("issueTableCell");
                issueDescription.innerHTML = `${data.description}`;

                const issueWriter = document.createElement('div');
                issueWriter.classList.add("issueTableCell");
                issueWriter.innerHTML = `${data.writer}`;

                const issueStatus = document.createElement('div');
                issueStatus.classList.add("issueTableCell");
                issueStatus.innerHTML = `${data.status}`;

                const issuePriorty = document.createElement('div');
                issuePriorty.classList.add("issueTableCell");
                if(data.priority==="BLOCKER" || data.priority==="CRITICAL") 
                    issuePriorty.innerHTML = `🚨${data.priority}`;
                else
                    issuePriorty.innerHTML = `${data.priority}`;

                issueTableRow.appendChild(issueId);
                issueTableRow.appendChild(projectId);
                issueTableRow.appendChild(issueTitle);
                issueTableRow.appendChild(issueDescription);
                issueTableRow.appendChild(issueWriter);
                issueTableRow.appendChild(issueStatus);
                issueTableRow.appendChild(issuePriorty);

                //최종 
                issueTableBody.appendChild(issueTableRow);
            })

        })
        .catch(error => {
            console.error('Error:', error);
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
