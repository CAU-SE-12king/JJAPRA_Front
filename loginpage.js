const baseURL = "https://jjapra.r-e.kr";

//  function login() {
//      const idInput = document.getElementById("userID");
//      const passwordInput = document.getElementById("userPassword");
//      const id = idInput.value;
//      const password = passwordInput.value;
//      console.log(id, password);

//      fetch(URL+"/login", {
//          method: 'POST', 
//          credentials: 'include',  // 쿠키를 포함하도록 설정
//          headers: {
//              'Content-Type': 'application/json',
//          },
//          body: JSON.stringify({
//              id : id,
//              password : password
//          })
//      })
//      .then((response)=> {
//          console.log(response.json());
//          if(response.status == 200){
//              alert("Login Successed");
//              // 사용자의 이름을 localStorage에 저장
//             localStorage.setItem('username', data.name);
//             console.log(data.name);
//             window.location.href="./ProjectList.html"
//          }
//          else{
//              alert("Please check your ID or Password.");
//              idInput.value = ""; 
//              passwordInput.value = "";
//          }
//      })
//      .catch((error) => {
//          console.error('Error:', error);
//      });
// }


const login = () => {
    const idInput = document.getElementById("userID");
     const passwordInput = document.getElementById("userPassword");
     const id = idInput.value;
     const password = passwordInput.value;
    //  console.log(id, password);

    // 입력 필드가 비어있는지 확인
    if (!id || !password) {
        alert("Please fill in all fields.");
        return; // 필수 필드 중 하나라도 비어있으면 함수 종료
    }

    axios.post(baseURL + "/login", {
        id: id,
        password: password
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.status === 200) {
            console.log(response.data);
            const name = response.data.name; // 응답에서 name 값 가져오기
            localStorage.setItem('username', name); // 사용자 이름 localStorage에 저장
            const TOKEN = response.data; // 응답에서 name 값 가져오기
            localStorage.setItem('TOKEN', TOKEN); // 사용자 이름 localStorage에 저장
            alert(`Welcome, ${name}!`); // name 값을 환영 메시지와 함께 표시
            // console.log(name); 토큰만 보내주는걸로 바뀌어서 잠깐 안함
            window.location.href = "./ProjectList.html";
        } else {
            throw new Error('Unexpected response status: ' + response.status);
        }
    })
    .catch(error => {
        if (error.response) {
            console.error('Error response:', error.response);
            alert("Failed to login: Please check your ID or Password.");
        } else if (error.request) {
            console.error('No response:', error.request);
            alert("No response from the server.");
        } else {
            console.error('Error:', error.message);
            alert("Error occurred: " + error.message);
        }
    });
};
