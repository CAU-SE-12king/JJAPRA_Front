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
    const dev = $('select#selectDev').val()
    const pl = $('select#selectPL').val()
    const tester = $('select#selectTester').val()

    fetch(baseURL+"projects", {
        method: 'POST', //이거중요!!
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title : title,
            description : description
        })
    })
    .then((response)=> {
        return response.json()
    })
    .then((response)=> {
        console.log(response);
        getData();
    })
}


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