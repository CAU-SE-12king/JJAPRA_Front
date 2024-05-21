const baseURL = "https://jjapra.r-e.kr/projects";
const test = document.getElementById("test");
const getData = () => {
    fetch(baseURL)
    .then((response)=> {
        return response.json();
    })
    .then((response)=> {
        console.log("< response >");
        console.log(response);
    })
}