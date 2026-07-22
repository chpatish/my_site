function a (ch, sh){
    return ch * sh
}
console.log(a(4, 3));

function gen(f){
    console.log('your gender is ' + f);
};
gen('fem');

const q = {
    w: 12,
    sq: 1,
    we:'look',
    
};
console.log(q);


const form = document.getElementById('form')
const name_input = document.getElementById('name-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_m = document.getElementById('error-m')

// МЫ ЗАМЕНИЛИ ТОЛЬКО ЭТОТ БЛОК: добавили async и сетевой запрос fetch
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Запрещаем странице перезагружаться

    let error = [];

    if(name_input){
        error = getSignupFormError(name_input.value, email_input.value, password_input.value, repeat_password_input.value) 
    }else{
        error = getLoginFormError(email_input.value, password_input.value)
    }

    if(error.length > 0){
        error_m.innerText = error.join('. ');
        error_m.style.color = 'red';
        return; // Если есть ошибки, останавливаем код и не отправляем данные на сервер
    }

    // --- НАЧАЛО ОТПРАВКИ НА БЭКЕНД ---
    const userData = {
        name: name_input.value.trim(),
        email: email_input.value.trim(),
        password: password_input.value
    };

    try {
        const response = await fetch('/api/signup', {


            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.success) {
            error_m.style.color = 'green';
            error_m.innerText = result.message;
            form.reset(); // Очищаем поля формы после успеха
        } else {
            error_m.style.color = 'red';
            error_m.innerText = result.message;
        }
    } catch (err) {
        console.error('Ошибка сети:', err);
        error_m.style.color = 'red';
        error_m.innerText = 'Не удалось подключиться к серверу.';
    }
    // --- КОНЕЦ ОТПРАВКИ НА БЭКЕНД ---
})

// ВСЕ ВАШИ ФУНКЦИИ НИЖЕ МЫ ОСТАВИЛИ БЕЗ ИЗМЕНЕНИЙ
function getSignupFormError(name, email, password, repeatPassword){
    let error = []

    if(name === '' || name == null || name.includes('a')){
        error.push('Name is required')
        name_input.parentElement.classList.add('wrong')
    }
    if(email === '' || email == null){
        error.push('Email is required')
        email_input.parentElement.classList.add('wrong')
    }
    if(password === '' || password == null){
        error.push('Password is required')
        password_input.parentElement.classList.add('wrong')
    }
    if(password !== repeatPassword){
        error.push('Password does not match')
        password_input.parentElement.classList.add('wrong')
        repeat_password_input.parentElement.classList.add('wrong')
    }
    if(password.length < 2){
        error.push('Too short')
        password_input.parentElement.classList.add('wrong')
        repeat_password_input.parentElement.classList.add('wrong')
    }

    return error;
}

const allInputs = [name_input, email_input, password_input, repeat_password_input]

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('wrong')){
            input.parentElement.classList.remove('wrong')
            error_m.innerText = ''
        }
    })
})
