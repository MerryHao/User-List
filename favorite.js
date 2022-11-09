const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")

const users = JSON.parse(localStorage.getItem('favoriteUsers'));

function renderUserList(data) {
  let rawHtml = "";
  data.forEach((item) => {
    rawHtml += `
    <div class="card m-2 pt-2" style="width: 10rem">
      <img src="${item.avatar}" class="card-img-top user-img" alt="user-list" data-bs-toggle="modal" data-id="${item.id}" data-bs-target="#userModal">
        <div class="card-body">
          <h6 class="card-text">${item.name} ${item.surname}</h6>
        </div>
      <button class="btn btn-info btn-remove-favorite mb-2" data-id="${item.id}">Delete</button>
    </div>
    `;
  });
  dataPanel.innerHTML = rawHtml;
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
    console.log(data);
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

function removeFromFavorite(id) {
  if (!users || !users.length) return
  const userIndex = users.findIndex(user => user.id === id)
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".user-img")) {
    //console.log(event.target.dataset);
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

renderUserList(users)