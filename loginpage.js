const URL = "https://jjapra.r-e.kr";

 function login() {
     const idInput = document.getElementById("userID");
     const passwordInput = document.getElementById("userPassword");
     const id = idInput.value;
     const password = passwordInput.value;
     console.log(id, password);

     fetch(URL+"/login", {
         method: 'POST', 
         credentials: 'include',  // 쿠키를 포함하도록 설정
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             id : id,
             password : password
         })
     })
     .then((response)=> {
         console.log(response.json());
         if(response.status == 200){
             alert("Login Successed");
            //  window.location.href="./ProjectList.html"
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