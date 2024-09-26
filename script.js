const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmout = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID =>{
    transactions = transactions.filter(transaction =>
         transaction.id !== ID)
    updatelocalStorage()
    init()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
   const operator = amount < 0 ? '-' : '+'
   const CSSclass = amount < 0 ? 'minus' : 'plus'
   const amountWithoutOperator = Math.abs(amount)
   const li = document.createElement('li')

   li.classList.add(CSSclass)
   li.innerHTML = `
     ${name} 
     <span>${operator} R$ ${amountWithoutOperator}</span>
     <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
   `
   transactionsUl.append(li)
}

const getExpenses = transactionAmounts => Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncome = transactionAmounts => transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionAmounts => transactionAmounts
.reduce((accumulator, transaction) => accumulator + transaction, 0)
.toFixed(2)

const updataBalanceValues = () => {
    const transactionAmounts = transactions.map(({ amount }) => amount)
    const total = getTotal(transactionAmounts)
    const income = getIncome(transactionAmounts)
    const expense = getExpenses(transactionAmounts)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updataBalanceValues()
}

init()

const updatelocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount)     
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmout.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()
  
    const transactionName = inputTransactionName.value.trim()
    const transactionAmout = inputTransactionAmout.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmout === ''

    if(isSomeInputEmpty){
      alert('Por favor, preencha tanto o nome quanto o valor da transação')
      return
    }
  
      addToTransactionsArray(transactionName, transactionAmout)
      init()
      updatelocalStorage()
      cleanInputs()
  }

form.addEventListener('submit', handleFormSubmit)