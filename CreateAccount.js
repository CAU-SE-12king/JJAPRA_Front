const baseURL = "https://jjapra.r-e.kr";

// const createAccount = () => {
//     const id = document.getElementById("ID").value;
//     const password = document.getElementById("password").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;
//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     const phone_num = document.getElementById("phoneNumber").value;

//     // 입력 필드가 비어있는지 확인
//     if (!id || !password || !confirmPassword || !name || !email || !phone_num) {
//         alert("Please fill in all fields.");
//         return; // 필수 필드 중 하나라도 비어있으면 함수 종료
//     }

//     // 비밀번호와 비밀번호 확인이 일치하는지 확인
//     if (password !== confirmPassword) {
//         alert("Passwords do not match. Please try again.");
//         return;  // 비밀번호가 일치하지 않으면 함수 종료
//     }
    
//     fetch(baseURL+"/join", {
//         method: 'POST', 
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'text/plain'
//         },
//         body: JSON.stringify({
//             id : id,
//             password : password,
//             name : name,
//             email : email,
//             phone_num : phone_num
//         })
//     })
//     .then((response)=> {
//         if (response.status == 400){ // 중복된 아이디
//             alert("Your ID already exists. \nPlease try different ID.");
//             return;
//         }
//         else {
//             alert("Your account has been created successfully.");
//             console.log(response);
//             window.location.href="./loginpage.html"
//         }

//         return response.text();
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

//     // 회원가입 성공 시 로그인 페이지로 이동
// }


const createAccount = async () => { //axios로 변경
    const id = document.getElementById("ID").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone_num = document.getElementById("phoneNumber").value;

    // 입력 필드가 비어있는지 확인
    if (!id || !password || !confirmPassword || !name || !email || !phone_num) {
        alert("Please fill in all fields.");
        return; // 필수 필드 중 하나라도 비어있으면 함수 종료
    }

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;  // 비밀번호가 일치하지 않으면 함수 종료
    }

    try {
        const response = await axios.post(`${baseURL}/join`, {
            id: id,
            password: password,
            name: name,
            email: email,
            phone_num: phone_num
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain'
            }
        });

        if (response.status === 400) {
            alert("Your ID already exists. \nPlease try a different ID.");
            return;
        } else {
            alert("Your account has been created successfully.");
            console.log(response);
            window.location.href = "./loginpage.html";
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
