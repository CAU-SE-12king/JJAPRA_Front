const projectList = document.getElementById('projectList');

const getData = () => {
    fetch('./test.json')
            // 가져온 데이터를 JSON 형식으로 변환
            .then(response => response.json())
            // 변환된 JSON 데이터를 콘솔에 출력
            .then((response)=> {
            console.log(response);

            response.map((data)=>{ //data 배열들을 돌면서 요소들 출력
                //wrapper 생성
                const a = document.createElement('a');
                a.classList.add("project");
                a.setAttribute('href', "./projects/project1.html");

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