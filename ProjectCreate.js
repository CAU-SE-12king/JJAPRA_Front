
const openProjectList = () => {
    // window.location.href = "./ProjectList.html"; // 기존 탭에서 전환
    window.open("./ProjectList.html", "_blank"); // 새 탭으로 열기
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

    return {
        projectName,
        projectDescription
    }
}