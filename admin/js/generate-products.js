const form = document.getElementById("productForm");
const preview = document.getElementById("imagePreview");
const progressBar = document.getElementById("progressBar");
const productGrid = document.getElementById("productGrid");


/* IMAGE PREVIEW */

document.querySelector("input[name='image']").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
    }
});


/* CREATE PRODUCT */

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", API_BASE + "/admin/create-product");

    xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("adminToken")
    );

    xhr.upload.onprogress = (event) => {

        if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            progressBar.style.width = percent + "%";
        }

    };

    xhr.onload = () => {

        if (xhr.status === 200) {

            alert("Product created");

            progressBar.style.width = "0%";

            form.reset();

            preview.src = "";

            loadProducts();

        } else {

            alert("Error creating product");

        }

    };

    xhr.send(formData);

});


/* LOAD PRODUCTS */

async function loadProducts() {

    try {

        const res = await fetch(API_BASE + "/admin/products", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("adminToken")
            }
        });

        const data = await res.json();
        const products = data.products;

        productGrid.innerHTML = "";

        products.forEach(p => {

            const card = document.createElement("div");

            card.className = "product";

            card.innerHTML = `
<img src="${API_BASE.replace('/api', '')}/uploads/${p.image}"
loading="lazy"
onerror="this.src='/assets/no-image.png">
<h3>${p.name}</h3>
<div class="small">Price: ₹${p.price}</div>
<div class="small">Daily: ₹${p.dailyIncome}</div>
<div class="small">Days: ${p.validityDays}</div>
`;

            productGrid.appendChild(card);

        });

    } catch (err) {

        console.error(err);

    }

}

loadProducts();