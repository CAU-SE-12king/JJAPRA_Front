const baseURL = "https://jjapra.r-e.kr";

function login() {
    const idInput = document.getElementById("userID");
    const passwordInput = document.getElementById("userPassword");
    const id = idInput.value;
    const password = passwordInput.value;

    fetch(baseURL+"/login", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify({
            id : id,
            password : password
        })
    })
    .then((response)=> {
        console.log(response.text());
        if(response.status == 200){
            alert("Login Successed");
            window.location.href="./ProjectList.html"
        }
        else{
            alert("Please check your ID or Password.");
            idInput.value = ""; 
            passwordInput.value = "";
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}