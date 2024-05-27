const baseURL = 'https://jjapra.r-e.kr';

//쿼리스트링으로 받아온 프로젝트 id를 토대로 프로트트 이름 가져오는 함수
function getProjectName(projectId) {
    axios.get(baseURL + "/projects/" + projectId, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'), //근데 이거 다른 계정으로 로그인하면 토큰 덮어씌워지나..? 흠...
        }
    })
    .then(response => {
        console.log(response.data);
    })
}