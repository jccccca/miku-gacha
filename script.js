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
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
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

// 粒子效果
function launchConfetti(){
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FF0A54','#FF477E','#FF7096','#FF85A1','#FBB1BD','#F9BEC7','#FAD0C4','#A0E7E5','#B4F8C8','#FBE7C6'];
  const confettiCount = 150;
  const confettis = [];

  for(let i=0;i<confettiCount;i++){
    confettis.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height - canvas.height,
      r: Math.random()*6 + 4,
      d: Math.random()*confettiCount,
      color: colors[Math.floor(Math.random()*colors.length)],
      tilt: Math.random()*10-10,
      tiltAngleIncremental: Math.random()*0.07+0.05,
      tiltAngle:0
    });
  }

  let animation;
  function drawFrame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<confettiCount;i++){
      const c = confettis[i];
      ctx.beginPath();
      ctx.lineWidth = c.r/2;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r/4, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r/4);
      ctx.stroke();
    }
    update();
  }

  function update(){
    for(let i=0;i<confettiCount;i++){
      const c = confettis[i];
      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(c.d) + 3 + c.r/2)/2;
      c.x += Math.sin(c.d);
      c.tilt = Math.sin(c.tiltAngle)*15;
      if(c.y>canvas.height){
        c.y = -10;
        c.x = Math.random()*canvas.width;
      }
    }
  }

  function animate(){
    drawFrame();
    animation = requestAnimationFrame(animate);
  }
  animate();

  setTimeout(()=>{
    cancelAnimationFrame(animation);
    ctx.clearRect(0,0,canvas.width,canvas.height);
  },3000);
}
