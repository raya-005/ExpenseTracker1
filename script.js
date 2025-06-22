class ExpenseTracker {
    constructor() {
      this.balanceEl = document.getElementById("balance");
      this.incEl = document.getElementById("money-plus");
      this.expEl = document.getElementById("money-minus");
      this.list = document.getElementById("list");
      this.form = document.getElementById("form");
      this.text = document.getElementById("text");
      this.amount = document.getElementById("amount");
      this.category = document.getElementById("category");
      this.transactionTypeInputs = document.getElementsByName("transactionType");
      this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  
      this.init();
      this.form.addEventListener("submit", this.addTransaction.bind(this));
    }
  
    getSelectedType() {
      for (const input of this.transactionTypeInputs) {
        if (input.checked) return input.value;
      }
      return "expense";
    }
  
    addTransaction(e) {
      e.preventDefault();
  
      const text = this.text.value.trim();
      const amtValue = this.amount.value.trim();
      const cat = this.category.value.trim();
      if (text === "" || amtValue === "" || cat === "") {
        alert("Enter description, amount, and category");
        return;
      }
  
      let amt = Math.abs(+amtValue);
      if (this.getSelectedType() === "expense") amt = -amt;
  
      const transaction = {
        id: Date.now(),
        text,
        amount: amt,
        category: cat
      };
  
      this.transactions.push(transaction);
      this.updateLocalStorage();
      this.init();
      this.text.value = "";
      this.amount.value = "";
      this.category.value = "";
    }
  
    removeTransaction(id) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.updateLocalStorage();
      this.init();
    }
  
    updateValues() {
      const amounts = this.transactions.map(t => t.amount);
      const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
      const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
      const expense = (amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1).toFixed(2);
  
      this.balanceEl.innerText = `$${total}`;
      this.incEl.innerText = `+$${income}`;
      this.expEl.innerText = `-$${expense}`;
    }
  
    addTransactionDOM(transaction) {
      const li = document.createElement("li");
      li.classList.add(transaction.amount < 0 ? "minus" : "plus");
      li.innerHTML = `
        <div>
          ${transaction.text}
          <span class="category">[${transaction.category}]</span>
        </div>
        <div>
          <span>${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
          <button class="delete-btn" onclick="tracker.removeTransaction(${transaction.id})">×</button>
        </div>
      `;
      this.list.appendChild(li);
    }
  
    updateLocalStorage() {
      localStorage.setItem("transactions", JSON.stringify(this.transactions));
    }
  
    init() {
      this.list.innerHTML = "";
      this.transactions.forEach(this.addTransactionDOM.bind(this));
      this.updateValues();
    }
  }
  
  const tracker = new ExpenseTracker();
  