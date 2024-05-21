
const getData = () => {
    fetch('./test.json')
            // 가져온 데이터를 JSON 형식으로 변환
            .then(response => response.json())
            // 변환된 JSON 데이터를 콘솔에 출력
            .then((response)=> {
            console.log(response);
            const projectList = document.getElementById('projectList');

            response.map((data)=>{ //data 배열들을 돌면서 요소들 출력
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
            })
            
        })
            
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
        console.log("logout");
        location.href = "./loginpage.html";
    } else {
        console.log("Logout canceled");
    }
}



// 서버 데이터 fetch test
const baseURL = "http://10.210.96.144:8080/projects";
const fetchData = () => {

    fetch(baseURL)
    .then((response)=> {
        return response.json();
    })
    .then((response)=> {
        console.log("< response >");
        console.log(response);
})
}