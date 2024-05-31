const baseURL = "https://jjapra.r-e.kr";

// 데이터 가져오기 함수
const fetchData = async () => {
    const token = localStorage.getItem("TOKEN");
    const response = await fetch(baseURL + "/issues", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
};

// 데이터 처리 함수
const processData = (data) => {
    const groupedData = data.reduce((acc, issue) => {
        const date = new Date(issue.createdAt[0], issue.createdAt[1] - 1, issue.createdAt[2]);
        const month = date.toLocaleString('default', { year: 'numeric', month: 'long' });

        if (!acc[month]) {
            acc[month] = { NEW: 0, ASSIGNED: 0, RESOLVED: 0, FIXED: 0, CLOSED: 0, REOPENED: 0 };
        }

        if (issue.status in acc[month]) {
            acc[month][issue.status]++;
        }

        return acc;
    }, {});

    return groupedData;
};

// 차트 생성 함수
const createChart = (groupedData) => {
    const labels = Object.keys(groupedData);
    const newIssues = labels.map(month => groupedData[month]['NEW']);
    const assignedIssues = labels.map(month => groupedData[month]['ASSIGNED']);
    const resolvedIssues = labels.map(month => groupedData[month]['RESOLVED']);
    const fixedIssues = labels.map(month => groupedData[month]['FIXED']);
    const closedIssues = labels.map(month => groupedData[month]['CLOSED']);

    const ctx = document.getElementById('issueChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'New Issues',
                    data: newIssues,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Assigned Issues',
                    data: assignedIssues,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Resolved Issues',
                    data: resolvedIssues,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Fixed Issues',
                    data: fixedIssues,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Closed Issues',
                    data: closedIssues,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        }
    });
};

// 메인 함수
const main = async () => {
    try {
        // await login(); // 로그인 수행
        const data = await fetchData(); // 데이터 가져오기
        console.log(data);
        const groupedData = processData(data); // 데이터 처리
        createChart(groupedData); // 차트 생성
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
};

main();


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

