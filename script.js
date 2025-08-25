const pool = [
  { name: "初音未来", rarity: "SSR", weight: 5, img: "image/miku.jpg" },
  { name: "樱花初音", rarity: "SR", weight: 10, img: "image/yuki-miku.jpg" },
  { name: "雪初音", rarity: "SR", weight: 10, img: "image/sakura-miku.jpg" },
  { name: "赛车初音", rarity: "R", weight: 15, img: "image/racing-miku.jpg" },
  { name: "初音Append", rarity: "R", weight: 15, img: "image/rabbit hole.jpg" },
  { name: "重音Teto风格", rarity: "R", weight: 45, img: "image/teto.jpg" }
];

const rarityColors = {
  "R": "linear-gradient(135deg, #a8d8ff, #c3bef0)",
  "SR": "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
  "SSR": "linear-gradient(135deg, #FFD87F, #FFECBA)"
};

let stats = {};
pool.forEach(item => stats[item.name] = 0);

const ctx = document.getElementById('drawChart').getContext('2d');
const drawChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: pool.map(item=>item.name),
    datasets: [{
      label: '抽取次数',
      data: pool.map(item=>stats[item.name]),
      backgroundColor: pool.map(item=>{
        switch(item.rarity){
          case 'SSR': return '#FFD87F';
          case 'SR': return '#FBC2EB';
          case 'R': return '#A8D8FF';
        }
      })
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }
});

function weightedPick(){
  const totalWeight = pool.reduce((sum,item)=>sum+item.weight,0);
  const r = Math.random()*totalWeight;
  let acc = 0;
  for(const item of pool){
    acc += item.weight;
    if(r<=acc) return item;
  }
  return pool[pool.length-1];
}

function draw(count){
  const cardsContainer = document.getElementById("cards");
  cardsContainer.innerHTML = "";
  let ssrDrawn = false;

  for(let i=0;i<count;i++){
    const item = weightedPick();
    stats[item.name] += 1;

    const card = document.createElement("div");
    card.className = "card";
    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front";
    front.innerText = "★";

    const back = document.createElement("div");
    back.className = "card-back";
    back.style.background = rarityColors[item.rarity];

    const img = document.createElement("img");
    img.src = item.img;

    const text = document.createElement("div");
    text.innerText = `${item.name} (${item.rarity})`;

    back.appendChild(img);
    back.appendChild(text);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    cardsContainer.appendChild(card);

    setTimeout(()=>{ card.classList.add("flip"); }, i*250);

    if(item.rarity === "SSR") ssrDrawn = true;
  }

  if(ssrDrawn) launchConfetti();

  drawChart.data.datasets[0].data = pool.map(item=>stats[item.name]);
  drawChart.update();
}

// 粒子效果函数 launchConfetti() 同原来的内容
