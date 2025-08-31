// Theme toggle (persist)
const body = document.body;
const toggleBtn = document.getElementById("toggle-theme");
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") body.classList.add("light");

function updateToggleIcon() {
  toggleBtn.textContent = body.classList.contains("light") ? "☀️" : "🌙";
}
updateToggleIcon();

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    body.classList.contains("light") ? "light" : "dark"
  );
  updateToggleIcon();
});

// Fetch data.json and render
async function carregarDados() {
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error("Não foi possível carregar data.json");
    const data = await res.json();

    // Home
    document.getElementById("profilePhoto").src =
      data.home.foto || "assets/img/foto_perfil.JPG";
    document.getElementById("homeName").textContent = data.home.nome || "";
    document.getElementById("homeDesc").textContent = data.home.descricao || "";

    // Sobre
    const sobreDiv = document.getElementById("sobreContent");
    sobreDiv.innerHTML = "";
    (data.sobre || []).forEach((par) => {
      const p = document.createElement("p");
      p.textContent = par;
      sobreDiv.appendChild(p);
    });

    // Tecnologias
    document.getElementById("tecnologiasIntro").textContent =
      "Essas são algumas tecnologias que utilizo em meus projetos:";
    const techGrid = document.getElementById("techGrid");
    techGrid.innerHTML = "";
    (data.tecnologias || []).forEach((t) => {
      const div = document.createElement("div");
      div.className = "tech";
      const img = document.createElement("img");
      img.src = t.icone;
      img.alt = t.nome;
      const span = document.createElement("span");
      span.textContent = t.nome;
      div.appendChild(img);
      div.appendChild(span);
      techGrid.appendChild(div);
    });

    // Projetos
    const projetosGrid = document.getElementById("projetosGrid");
    projetosGrid.innerHTML = "";
    (data.projetos || []).forEach((p, idx) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.imagem}" alt="${p.titulo}">
        <h3>${p.titulo}</h3>
        <p>${p.descricao}</p>
        <div class="tags">${(p.tecnologias || [])
          .map((t) => `<span class="tag">${t}</span>`)
          .join("")}</div>
      `;
      card.addEventListener("click", () => openProjectModal(p));
      projetosGrid.appendChild(card);
    });

    // Contato
    document.getElementById("contatoMsg").textContent =
      data.contato.mensagem || "";
    const contatoLinks = document.getElementById("contatoLinks");
    contatoLinks.innerHTML = "";
    (data.contato.links || []).forEach((link) => {
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const img = document.createElement("img");
      img.src = link.icone;
      img.alt = "Link";
      a.appendChild(img);
      contatoLinks.appendChild(a);
    });
  } catch (err) {
    console.error(err);
    // fallback: show an error message in the Sobre section
    document.getElementById("sobreContent").innerHTML =
      "<p>Erro ao carregar conteúdo. Verifique o arquivo data.json e o caminho.</p>";
  }
}

/* Modal project */
const modal = document.getElementById("projectModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalTech = document.getElementById("modalTech");
const closeModalBtn = document.getElementById("closeModal");

function openProjectModal(project) {
  modalImage.src = project.imagem || "";
  modalTitle.textContent = project.titulo || "";
  modalBody.textContent = project.detalhes || project.descricao || "";
  modalTech.innerHTML = (project.tecnologias || [])
    .map((t) => `<span class="tag">${t}</span>`)
    .join(" ");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }
});

// initial
document.addEventListener("DOMContentLoaded", carregarDados);
