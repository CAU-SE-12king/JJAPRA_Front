const baseURL = "https://jjapra.r-e.kr/";


const openProjectList = () => {
    // window.location.href = "./ProjectList.html"; // 기존 탭에서 전환
    window.location.href="./ProjectList.html";
    getProjectInputs();
}

const getProjectInputs = () => {
    //모두 채워지지 않았으면 alert
    if (!document.getElementById("projectName").value || !document.getElementById("projectDescription").value) {
        alert("Please fill in all fields.");
        return;
    }
    const projectName = document.getElementById("projectName").value;
    const projectDescription = document.getElementById("projectDescription").value;
    const dev = $('select#selectDev').val()
    const pl = $('select#selectPL').val()
    const tester = $('select#selectTester').val()
    
    //확인
    console.log(projectName, projectDescription, dev, pl, tester);
    const confirmed = confirm("Are you sure you want to create this project? \n\n < Project Info >\n Title : " + projectName + "\n Description : " + projectDescription + "\n Dev : " + dev + "\n PL : " + pl + "\n Tester : " + tester);
    if (confirmed) {
        console.log("Project created");
        // postData(projectName, projectDescription, dev, pl, tester);
    } else {
        console.log("Project Creation canceled");
    }

    //여기서 post하면, 끝나고 project list get 할 때 자동으로 추가됨!!!
}


const postData = () => {
    const title = document.getElementById("projectName").value;
    const description = document.getElementById("projectDescription").value;
    const dev = $('select#selectDev').val();
    const pl = $('select#selectPL').val();
    const tester = $('select#selectTester').val();

    axios.post(baseURL + "projects", {
        title: title,
        description: description
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.status === 200 || response.status === 201) {
            console.log(response.data);
            alert("Project created successfully.");
            getData();
        } else {
            throw new Error('Unexpected response status: ' + response.status);
        }
    })
    .catch(error => {
        if (error.response) {
            // 서버가 상태 코드를 반환했지만 2xx 범위에 있지 않은 경우
            console.error('Error response:', error.response);
            alert(`Failed to create project: ${error.response.status} ${error.response.data.error}`);
        } else if (error.request) {
            // 요청이 만들어졌지만 응답을 받지 못한 경우
            console.error('No response:', error.request);
            alert("No response from the server.");
        } else {
            // 요청 설정 중에 문제가 발생한 경우
            console.error('Error:', error.message);
            alert("Error occurred: " + error.message);
        }
    });
};


function logOut() {
    const confirmed = confirm("Are you sure you want to log out?");
    if (confirmed) {
        console.log("logout");
        location.href = "./loginpage.html";
    } else {
        console.log("Logout canceled");
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