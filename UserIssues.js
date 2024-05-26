const baseURL = 'https://jjapra.r-e.kr';

const getUserIssues = () => { //axios로 변경
    axios.get(baseURL + "/issues", {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), 
        }
    })
        .then(response => {
            console.log(response.data);
            // const projectList = document.getElementById('projectList');

            // response.data.forEach(data => { //data 배열들을 돌면서 요소들 출력
            //     //wrapper 생성
            //     const a = document.createElement('a');
            //     a.classList.add("project");
            //     a.setAttribute('href', "./ProjectManage.html");

            //     // 랜덤 색상 생성 및 적용
            //     const randomColor = getRandomColor();
            //     a.style.borderLeftColor = randomColor;

            //     const projectTitle = document.createElement('div');
            //     projectTitle.classList.add('projectTitle');
            //     projectTitle.innerHTML = `${data.title}`;

            //     const projectDescription = document.createElement('div');
            //     projectDescription.classList.add('projectDescription');
            //     projectDescription.innerHTML = `${data.description}`;

            //     a.appendChild(projectTitle);
            //     a.appendChild(projectDescription);
            //     projectList.appendChild(a);
            // });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
