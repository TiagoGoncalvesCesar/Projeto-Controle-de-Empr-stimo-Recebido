document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loan-form");
    const amountInput = document.getElementById("amount");
    const dateInput = document.getElementById("date");
    const totalSpan = document.getElementById("total");
    const amountList = document.getElementById("amount-list");
    const resetButton = document.getElementById("reset-button");

    // Função para formatar a data
    function formatDate(date) {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year.slice(2)}`;
    }

    // Carregar valores salvos do localStorage
    let amounts = JSON.parse(localStorage.getItem("amounts")) || [];
    let total = amounts.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    // Atualizar a interface do usuário
    function updateUI() {
        totalSpan.textContent = total.toFixed(2);
        amountList.innerHTML = '';
        amounts.forEach((entry, index) => {
            const li = document.createElement("li");
            li.textContent = `R$ ${parseFloat(entry.amount).toFixed(2)} - ${formatDate(entry.date)}`;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Excluir";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", () => {
                amounts.splice(index, 1);
                localStorage.setItem("amounts", JSON.stringify(amounts));
                total = amounts.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                updateUI();
            });
            li.appendChild(deleteButton);
            amountList.appendChild(li);
        });
    }

    updateUI();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const amount = parseFloat(amountInput.value);
        const date = dateInput.value;
        if (!isNaN(amount) && amount > 0 && date) {
            const entry = { amount: amount, date: date };
            amounts.push(entry);
            localStorage.setItem("amounts", JSON.stringify(amounts));

            total += amount;
            updateUI();

            amountInput.value = "";
            dateInput.value = "";
        }
    });

    resetButton.addEventListener("click", () => {
        amounts = [];
        localStorage.setItem("amounts", JSON.stringify(amounts));
        total = 0;
        updateUI();
    });
});
