'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Caleb Yeboah',
  movements: [200000, 450000, 10000, 3000, 900000, 34200, 40000, 1300],
  interestRate: 2.5, // %
  pin: 9090,
};
const account2 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account3 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account4 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account5 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${Math.abs(mov)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Date
const date = new Date();
labelDate.textContent = `0${date.getUTCDate()}/0${
  date.getUTCMonth() + 1
}/${date.getFullYear()}`;

const calcDisplayBalance = function (account) {
  const { movements } = account;
  account.balance = movements.reduce((acc, cur) => acc + cur, 0);
  console.log(movements, balance);

  labelBalance.textContent = `${account.balance} €`;
};

const calcDisplaySummary = function (account) {
  const { movements, interestRate } = account;

  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);

  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposits => deposits * (interestRate / 100))
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;

  console.log(incomes, out, interest);
};

// const user = 'Steven Thomas Williams';
// const userName = user
//   // toLowerCase returns a string
//   .toLowerCase()

//   // split returns an array
//   .split(' ')

//   // map returns a new array based in the existing array
//   .map(name => {
//     return name[0];
//   })
//   // join returns a string
//   .join('');

// console.log(userName);

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// LOGIN USER
// Event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevents form from submitting immediately
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // CONDITIONAL DISPLAYS
  if (
    !currentAccount?.username &&
    !currentAccount?.pin &&
    typeof currentAccount?.pin !== 'number'
  ) {
    labelWelcome.textContent = 'Invalid login details. Please, try again!';
    labelWelcome.style.color = 'red';
  } else if (
    currentAccount?.username &&
    currentAccount?.pin !== Number(inputLoginPin.value)
  ) {
    labelWelcome.textContent = 'Wrong pincode! Please, try again';
    labelWelcome.style.color = 'red';

    // Sucessful login
  } else if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    const firstName = currentAccount.owner.split(' ')[0];
    labelWelcome.textContent = `Welcome back, ${firstName}`;
    labelWelcome.style.color = '#444444';
    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => {
    return acc.username === inputTransferTo.value;
  });

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount?.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log('Transfer Valid');

    // Update UI
    updateUI(currentAccount);
  }
});

// REQUEST for a Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const { movements } = currentAccount;

  // Get amount user is requesting for from UI
  const amount = Number(inputLoanAmount.value);

  // Check if deposits > 10% of requested amount
  const anyDeposit = movements.some(mov => mov >= 0.1 * amount);

  if (amount > 0 && anyDeposit) {
    // Add amount (positive movement) to the account
    movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  // Clear input field
  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Check for matching Username and PIN from the UI
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // find matching index based on condition
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Update UI
    containerApp.style.opacity = 0;
  }

  // Reset input values on the UI
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
