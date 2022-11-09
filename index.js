const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")

const users = [];
const USERS_PER_PAGE = 12
let filteredUsers = []

function renderUserList(data) {
  let rawHtml = "";
  data.forEach((item) => {
    rawHtml += `
    <div class="card m-2 pt-2" style="width: 10rem">
      <img src="${item.avatar}" class="card-img-top user-img" alt="user-list" data-bs-toggle="modal" data-id="${item.id}" data-bs-target="#userModal">
        <div class="card-body">
          <h6 class="card-text">${item.name} ${item.surname}</h6>
        </div>
      <button class="btn btn-info btn-add-favorite mb-2" data-id="${item.id}">Like</button>
    </div>
    `;
  });
  dataPanel.innerHTML = rawHtml;
}

function renderPaginator(userAmount) {
  const numberOfPages = Math.ceil(userAmount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

function showUserModal(id) {
  const userAvatar = document.querySelector("#user-modal-avatar");
  const userName = document.querySelector("#user-modal-username");
  const userGender = document.querySelector("#user-modal-gender");
  const userRegion = document.querySelector("#user-modal-region");
  const userAge = document.querySelector("#user-modal-age");
  const userBirthday = document.querySelector("#user-modal-birthday");
  const userEmail = document.querySelector("#user-modal-email");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    //console.log(data);
    userAvatar.innerHTML = `
    <img src="${data.avatar}" alt="user-avatar">
    `;
    userName.innerText = data.name + " " + data.surname;
    userGender.innerText = "Gender: " + data.gender;
    userRegion.innerText = "Region: " + data.region;
    userAge.innerText = "Age: " + data.age;
    userBirthday.innerText = "Birthday: " + data.birthday;
    userEmail.innerText = "Email: " + data.email;
  });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find(user => user.id === id)
  if (list.some(user => user.id === id)) {
    return alert("The user has already in the favorite list.")
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

function getUserByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  console.log(keyword)
  if (!keyword.length) {
    alert("請輸入有效字串");
  }
  //let filteredUsers = []
  filteredUsers = users.filter(user => user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword))
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  console.log(filteredUsers)
  renderPaginator(filteredUsers.length)
  renderUserList(getUserByPage(1))
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderUserList(getUserByPage(page))
})

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".user-img")) {
    //console.log(event.target.dataset);
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  }
});
axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results);
  renderPaginator(users.length)
  renderUserList(getUserByPage(1));
});