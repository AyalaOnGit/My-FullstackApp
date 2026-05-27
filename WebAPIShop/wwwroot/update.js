const welcomeText = document.querySelector(".greeting")
welcomeText.innerHTML = `שלום ${JSON.parse(sessionStorage.getItem('currentUser')).userFirstName} <br> !התחברת בהצלחה`

const updateBox = document.querySelector(".updateBox")
const updateUser = document.querySelector(".updateUser")
updateUser.style.display = 'none'

updateBox.addEventListener("click", () => {
    updateUser.style.display = 'block'
})

function validateEmail(email) {
    return email.includes("@") && email.includes(".");
}

const userEmail = document.querySelector("#userName")
const firstName = document.querySelector("#firstName")
const lastName = document.querySelector("#lastName")
const password = document.querySelector("#password")

const currentUser = sessionStorage.getItem("currentUser")
const theCurrentUser = JSON.parse(currentUser)

const update = async () => {
    try {
        if (!validateEmail(userEmail.value)) {
            alert("כתובת האימייל אינה תקינה");
            return;
        }

        if (password.value.length < 4 || password.value.length > 20) {
            alert("הסיסמה חייבת להיות בין 4 ל-20 תווים");
            return;
        }

        const updateUser = {
            UserId: theCurrentUser.userId,
            UserEmail: userEmail.value,
            UserFirstName: firstName.value,
            UserLastName: lastName.value,
            UserPassword: password.value
        }
        const response = await fetch(`https://localhost:44324/api/Users/${theCurrentUser.userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateUser)
        });
        if (response.ok) {
            alert(" עודכן בהצלחה")
            sessionStorage.setItem("currentUser", JSON.stringify(updateUser))
            welcomeText.innerHTML = `שלום ${JSON.parse(sessionStorage.getItem('currentUser')).UserFirstName} <br> !התחברת בהצלחה`
        }

        else {
            alert("בעדכון יש בעיה")
        }
    } catch (err) {
        alert(err)
    }
    
}
