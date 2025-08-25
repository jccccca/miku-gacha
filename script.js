const pool = [
  { name: "初音未来", img: "images/miku.jpg", rarity: "SSR" },
  { name: "雪初音", img: "images/yuki-miku.jpg", rarity: "SR" },
  { name: "樱花初音", img: "images/sakura-miku.jpg", rarity: "SR" },
  { name: "赛车初音", img: "images/racing-miku.jpg", rarity: "R" },
  { name: "rabbit hole", img: "images/rabbit hole.jpg", rarity: "R" },
  { name: "重音Teto风格", img: "images/teto.jpg", rarity: "R" }
];

const stats = {};
pool.forEach(item => stats[item.name] = 0);

const ctx = document.getElementById('chart').getContext('2d');
const drawChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: pool.map(p => p.name),
    datasets: [{
      label: '抽取次数',
      data: pool.map(p => stats[p.name]),
      backgroundColor: pool.map(p => getCardColor(p.rarity))
    }]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  }
});

function getCardColor(rarity) {
  switch(rarity) {
    case "SSR": return "#FFD700";
    case "SR": return "#FF69B4";
    default: return "#87CEFA";
  }
}

function draw(count) {
  const cardsContainer = document.getElementById("cards");
  cardsContainer.innerHTML = "";
  const results = [];

  for (let i = 0; i < count; i++) {
    const random = pool[Math.floor(Math.random() * pool.length)];
    results.push(random);
    stats[random.name]++;

    const card = document.createElement("div");
    card.className = "card";
    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front";
    front.innerText = "★";

    const back = document.createElement("div");
    back.className = "card-back";
    back.style.background = getCardColor(random.rarity);

    const img = document.createElement("img");
    img.src = random.img;

    const text = document.createElement("div");
    text.innerText = random.name;

    back.appendChild(img);
    back.appendChild(text);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    cardsContainer.appendChild(card);

    setTimeout(() => card.classList.add("flip"), 200 * i);

    if (random.rarity === "SSR") {
      triggerParticles();
    }
  }

  drawChart.data.datasets[0].data = pool.map(item => stats[item.name]);
  drawChart.update();
}

function triggerParticles() {
  const container = document.getElementById("particle-container");
  for (let i = 0; i < 100; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = particle.style.height = "8px";
    particle.style.background = `hsl(${Math.random()*360},100%,50%)`;
    particle.style.borderRadius = "50%";
    particle.style.top = `${Math.random()*100}%`;
    particle.style.left = `${Math.random()*100}%`;
    particle.style.opacity = 1;
    particle.style.transition = "all 1s linear";

    container.appendChild(particle);

    setTimeout(() => {
      particle.style.top = `${Math.random()*100}%`;
      particle.style.left = `${Math.random()*100}%`;
      particle.style.opacity = 0;
    }, 50);

    setTimeout(() => container.removeChild(particle), 1050);
  }
}
