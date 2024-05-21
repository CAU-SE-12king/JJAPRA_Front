const baseURL = "http://165.194.89.56:8080/projects";


const openProjectList = () => {
    // window.location.href = "./ProjectList.html"; // 기존 탭에서 전환
    window.location.href="./ProjectList.html";
    getProjectInputs();
}

const getProjectInputs = () => {
    const projectName = document.getElementById("projectName").value;
    const projectDescription = document.getElementById("projectDescription").value;
    const dev = $('select#selectDev').val()
    const pl = $('select#selectPL').val()
    const tester = $('select#selectTester').val()
    
    //확인
    console.log(projectName, projectDescription, dev, pl, tester);

    //여기서 post하면, 끝나고 project list get 할 때 자동으로 추가됨!!!
}

///
// const test = document.getElementById("test");
// const getData = () => {
//     fetch(baseURL)
//     .then((response)=> {
//         return response.json();
//     })
//     .then((response)=> {
//         console.log("< response >");
//         console.log(response);
//     })
// }

const getData = () => {
    fetch('./test.json')
            // 가져온 데이터를 JSON 형식으로 변환
            .then(response => response.json())
            // 변환된 JSON 데이터를 콘솔에 출력
            .then((response)=> {
            console.log("< response >");
            console.log(response);
            })
            
}