async function getAPI(url) {
      try {
        const data = await fetch(url);
        const dataJson = await data.json();            
        return dataJson;
      } catch (error) {
        return error;
      } 
}

function Header(user) {  
  return `
    <header class="nav-menu">
    <div class="div-profile">
      <img class="img-profile" src="${user.avatar_url}" alt="">
      <div class="div-profile-information">
        <h2 class="profile-name">${user.name}</h2>
        <p class="profile-ocupation">${user.bio}</p>
      </div>
    </div>
    <div class="div-buttons-menu">
      <a href="mailto:${user.email}" class="email-button" target="_blank">Email</a>
      <button class="change-user-button">Trocar de usuário</button>
    </div>
  </header>
      `;
}
  

function Repository(name, url, description) {
      return `
            <li class="li-repository">
                <h2 class="title-repository">${name}</h2>
                <p class="text-repository">${description}</p>
                <div class="div-buttons-repository">
                    <a href="${url}" target="_blank"><button class="button-repository" target="_blank">Repositório</button><a>
                    <a><button class="button-demo">Demo</button><a>
            </div>
            </li>
        `;
}

const body = document.querySelector('.container')
const profile = document.querySelector('.main-header ')
const home = document.querySelector('.home-page')
const input = document.querySelector('.input-search')
const buttonInput = document.querySelector('.button-search')
const mainHeader = document.querySelector('.main-header')
const ulRepository = document.querySelector('.ul-repository')
const buttonLoading = document.querySelector('.button-loading')
let array = []


async function Main(userSearched) {
      if(userSearched !== undefined){
      const baseURL = `https://api.github.com/users/${userSearched}`;
      const userDetails = await getAPI(baseURL);
      const repositories = await getAPI(`${baseURL}/repos`); 

      array.push(userDetails)

      const usersJson = JSON.stringify(array);
      localStorage.setItem("users", usersJson); 

      mainHeader.insertAdjacentHTML(

        "afterbegin",
        `  
        ${Header(userDetails)}
   
        `
);      
      ulRepository.insertAdjacentHTML(

        "beforeend",
        `  
            ${repositories
            .map((repository) =>                 
             Repository(repository.name, repository.html_url, repository.description)
                 )
                 .join("")}
        `
);  
            }         
}
 

function keyUpEvent(){
  input.addEventListener('keyup', (event) => {
    buttonInactiveChange()
  });
}
keyUpEvent()


function buttonInputPressed(){
buttonInput.addEventListener('click',(e)=>{
  e.preventDefault()
  const value = input.value;
  classChange(value) 
  input.value = '' 
  buttonInput.classList.add('none')
  inativeButton.classList.add('none')
  buttonLoading.classList.remove('none')
})
}
buttonInputPressed()

const inativeButton = document.querySelector('.button-inactive')
const notFoundText = document.querySelector('.not-found')
async function classChange(value){
  try {
    const data = await fetch(`https://api.github.com/users/${value}`);
    const dataJson = await data.json(); 
    if(dataJson.message !== "Not Found"){
        home.classList.add('none')
        profile.classList.remove('none')
        Main(value)
        notFoundText.classList.add('none')
        buttonLoading.classList.remove('none') 
        body.classList.add('home-page-width')
        changeUser()  
    }else{
      home.classList.remove('none')   
      profile.classList.add('none') 
      notFoundText.classList.remove('none')
      buttonLoading.classList.add('none')
      inativeButton.classList.remove('none')
      body.classList.remove('home-page-width')
    }
  } catch (error) {

  } 
}

function buttonInactiveChange(){
  if(input.value !== ''){
    buttonInput.classList.remove('none') 
    inativeButton.classList.add('none') 
    buttonLoading.classList.add('none')  
  }else if(input.value == ''){
    buttonInput.classList.add('none') 
    buttonLoading.classList.add('none')
    inativeButton.classList.remove('none') 
  }
}

function changeUser(){
setTimeout(()=>{
  const changeUserButton = document.querySelector('.change-user-button')
    changeUserButton.addEventListener('click', function(e){
      window.location.reload(true);
    })
  },1000)
}


const ulHistory = document.querySelector('.ul-history')
function renderUsers(){
    const usersLocalJSON = localStorage.getItem("users");
    const usersLocal = JSON.parse(usersLocalJSON);
    for(i = 0; i < usersLocal.length; i++){
    ulHistory.insertAdjacentHTML("afterbegin", `
    <li class="li-history">
      <img class="img-history" src="${usersLocal[i].avatar_url}" alt="user"></img>
      <button class="button-history none">Acessar este perfil</button>
    </li>
    `)
    }
}
renderUsers()

const buttonUser = document.querySelector('.button-history')
const imgUser = document.querySelector('.img-history')
function imgAcessUser(){
  imgUser.addEventListener('mouseover', function(){
    buttonUser.classList.remove('none')
    setTimeout(()=>{
      buttonUser.classList.add('none')
    },3000)
  })
}
imgAcessUser()

function buttonAcessUser(){
  const usersLocalJSON = localStorage.getItem("users");
  const usersLocal = JSON.parse(usersLocalJSON);
  const nameUser = usersLocal[0].login
  buttonUser.addEventListener('click', function(){
     Main(nameUser)
     home.classList.add('none')
     profile.classList.remove('none')
     notFoundText.classList.add('none')
     buttonLoading.classList.remove('none') 
     body.classList.add('home-page-width')
     changeUser()  
  })
}
buttonAcessUser()

// não consegui renderizar os 3 usuários na home page porque surgiu vários bugs quando tentei, então está 
// renderizando apenas 1, porém está salvando no localStorage e o botão do perfil é funcional