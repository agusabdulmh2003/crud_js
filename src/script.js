document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem("user")) {
        window.location.href = "login.html";
    }
    loadData();
    applyDarkMode();
});

let currentPage = 1;
const rowsPerPage = 5;
let dataCache = [];
let chartInstance = null;

function showForm(id = "", name = "", description = "") {
    let form = document.getElementById("form");
    form.classList.toggle("hidden", !id && !name && !description);

    document.getElementById("itemId").value = id;
    document.getElementById("itemName").value = name;
    document.getElementById("itemDesc").value = description;
}

function resetForm() {
    document.getElementById("itemId").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("itemDesc").value = "";
}

function saveData() {
    let id = document.getElementById("itemId").value;
    let name = document.getElementById("itemName").value.trim();
    let desc = document.getElementById("itemDesc").value.trim();

    if (!name || !desc) {
        alert("Nama dan Deskripsi tidak boleh kosong!");
        return;
    }

    if (id && !confirm("Yakin ingin menyimpan perubahan ini?")) return;

    fetch(`../server/crud.php?action=${id ? "update" : "add"}`, {
        method: "POST",
        body: new URLSearchParams({ id, name, description: desc })
    }).then(() => {
        loadData();
        showForm();
    });
}

function loadData() {
    fetch("../server/crud.php?action=get")
        .then(res => res.json())
        .then(data => {
            dataCache = data;
            renderTable();
            updateChart();
        });
}

function renderTable() {
    let start = (currentPage - 1) * rowsPerPage;
    let paginatedData = dataCache.slice(start, start + rowsPerPage);

    document.getElementById("data-list").innerHTML = paginatedData.map(d =>
        `<tr>
            <td class="border p-2">${d.name}</td>
            <td class="border p-2">${d.description}</td>
            <td class="border p-2">
                <button onclick="editData(${d.id}, '${d.name}', '${d.description}')" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onclick="deleteData(${d.id})" class="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
            </td>
        </tr>`
    ).join("");

    document.getElementById("page-info").innerText = `Halaman ${currentPage} dari ${Math.ceil(dataCache.length / rowsPerPage)}`;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    if (currentPage * rowsPerPage < dataCache.length) {
        currentPage++;
        renderTable();
    }
}

function editData(id, name, description) {
    showForm(id, name, description);
}

function deleteData(id) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    fetch("../server/crud.php?action=delete", {
        method: "POST",
        body: new URLSearchParams({ id })
    }).then(() => {
        loadData();
        showToast("Data berhasil dihapus!");
    });
}

function showToast(msg) {
    let toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
}

function toggleDarkMode() {
    document.body.classList.toggle("bg-gray-900");
    document.body.classList.toggle("text-white");
    localStorage.setItem("darkMode", document.body.classList.contains("bg-gray-900"));
}

function applyDarkMode() {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("bg-gray-900", "text-white");
    }
}

function sortData() {
    let sortBy = document.getElementById("sort").value;
    
    if (!sortBy || !dataCache.length) return;

    dataCache.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : -1);
    renderTable();
}

function logout() {
    sessionStorage.removeItem("user");
    window.location.href = "login.html";
}

function updateChart() {
    let categories = ["Total Data"];
    let values = [dataCache.length];

    let ctx = document.getElementById("dataChart").getContext("2d");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: categories,
            datasets: [{
                label: "Jumlah Data",
                data: values,
                backgroundColor: "rgba(54, 162, 235, 1)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
