document.addEventListener('DOMContentLoaded', () => {

  // Parse data from your JSON strings
  const allUsers = JSON.parse(userContent);
  const allStocks = JSON.parse(stockContent);

  const deleteBtn = document.querySelector('#btnDelete');
  const saveBtn = document.querySelector('#btnSave');

  // Initial rendering
  buildUserList(allUsers, allStocks);

  // Single listener for user clicks
  const userListElement = document.querySelector('.user-list');
  userListElement.addEventListener('click', (e) => handleUserClick(e, allUsers, allStocks));

  // DELETE functionality
  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedId = document.querySelector('#userID').value;
    const index = allUsers.findIndex(u => u.id == selectedId);
    if (index !== -1) {
      allUsers.splice(index, 1);
      buildUserList(allUsers, allStocks);
      clearForm();
      clearPortfolio();
      clearStockDetails();
    }
  });

  // SAVE functionality
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedId = document.querySelector('#userID').value;
    const userObj = allUsers.find(u => u.id == selectedId);
    if (userObj) {
      const form = document.querySelector('.userEntry');
      userObj.user.firstname = form.querySelector('#firstname').value;
      userObj.user.lastname = form.querySelector('#lastname').value;
      userObj.user.address = form.querySelector('#address').value;
      userObj.user.city = form.querySelector('#city').value;
      userObj.user.email = form.querySelector('#email').value;
      buildUserList(allUsers, allStocks);
    }
  });

});

// ==========================================
// FUNCTIONS
// ==========================================

function buildUserList(users, stocks) {
  const listEl = document.querySelector('.user-list');
  listEl.innerHTML = '';

  users.forEach(({ user, id }) => {
    const li = document.createElement('li');
    li.textContent = `${user.lastname}, ${user.firstname}`;
    li.dataset.id = id;
    listEl.appendChild(li);
  });
}

function handleUserClick(event, users, stocks) {
  const clickedId = event.target.dataset.id;
  const selectedUser = users.find(u => u.id == clickedId);
  if (selectedUser) {
    fillUserForm(selectedUser);
    renderUserPortfolio(selectedUser, stocks);
  }
}

function fillUserForm(userObj) {
  const { user, id } = userObj;
  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

function renderUserPortfolio(userObj, stocks) {
  const portfolioEl = document.querySelector('.portfolio-list');
  portfolioEl.innerHTML = `
    <h3>Symbol</h3>
    <h3>Shares</h3>
    <h3>Action</h3>
  `;

  userObj.portfolio.forEach(({ symbol, owned }) => {
    const symEl = document.createElement('p');
    symEl.textContent = symbol;

    const sharesEl = document.createElement('p');
    sharesEl.textContent = owned;

    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View';
    viewBtn.dataset.symbol = symbol;

    portfolioEl.appendChild(symEl);
    portfolioEl.appendChild(sharesEl);
    portfolioEl.appendChild(viewBtn);
  });

  // Single listener for all "View" buttons
  portfolioEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const symbol = e.target.dataset.symbol;
      displayStockInfo(symbol, stocks);
    }
  });
}

function displayStockInfo(symbol, stocks) {
  const stock = stocks.find(s => s.symbol == symbol);
  if (!stock) return;

  document.querySelector('#stockName').textContent = stock.name;
  document.querySelector('#stockSector').textContent = stock.sector;
  document.querySelector('#stockIndustry').textContent = stock.subIndustry || stock.industry;
  document.querySelector('#stockAddress').textContent = stock.address;
  document.querySelector('#logo').src = `logos/${symbol}.svg`;
}

// ==========================================
// CLEAR FUNCTIONS
// ==========================================
function clearForm() {
  document.querySelector('#userID').value = '';
  document.querySelector('#firstname').value = '';
  document.querySelector('#lastname').value = '';
  document.querySelector('#address').value = '';
  document.querySelector('#city').value = '';
  document.querySelector('#email').value = '';
}

function clearPortfolio() {
  document.querySelector('.portfolio-list').innerHTML = '';
}

function clearStockDetails() {
  document.querySelector('#stockName').textContent = '';
  document.querySelector('#stockSector').textContent = '';
  document.querySelector('#stockIndustry').textContent = '';
  document.querySelector('#stockAddress').textContent = '';
  document.querySelector('#logo').src = '';
}