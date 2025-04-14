export const mundoBatedores = {
  nome: "OS BATEDORES DE TT'TOK'TAK'TAK'T",
  
  visor: function carregarGlobo() {
    const visor = document.getElementById('visor');
    visor.innerHTML = `<canvas id="globeCanvas"></canvas>`;
    // Agora chama o globo específico dos batedores:
    initGloboBatedores(); 
  },

  flipbook: [
    { img: "imagens/cap1/capa.webp" },
    { img: "imagens/cap1/capa2.webp" },
    { img: "imagens/cap1/contracapa.webp" },
    { img: "imagens/cap1/pagina1.webp" },
    { img: "imagens/cap1/pagina2.webp" },
    { img: "imagens/cap1/pagina3.webp" },
    { img: "imagens/cap1/pagina4.webp" },
    { img: "imagens/cap1/pagina5.webp" },
    { img: "imagens/cap1/pagina6.webp", botao: "cliquemundo" },
    { img: "imagens/cap1/pagina7.webp" },
    { img: "imagens/cap1/pagina8.webp" },
    { img: "imagens/cap1/pagina9.webp" },
    { img: "imagens/cap1/pagina10.webp", botao: "cliqueinversao" },
    { img: "imagens/cap1/pagina11.webp" },
    { img: "imagens/cap1/pagina12.webp", botao: "cliqueg" },
    { img: "imagens/cap1/pagina13.webp" },
    { img: "imagens/cap1/pagina14.webp", botao: "cliquerefracao" },
    { img: "imagens/cap1/pagina15.webp" },
    { img: "imagens/cap1/pagina16.webp" },
    { img: "imagens/cap1/pagina17.webp", botao: "cliquemorse" },
    { img: "imagens/cap1/pagina18.webp" },
    { img: "imagens/cap1/pagina19.webp" },
    { img: "imagens/cap1/pagina20.webp" },
    { img: "imagens/cap1/pagina21.webp" },
    { img: "imagens/cap1/pagina22.webp" },
    { img: "imagens/cap1/pagina23.webp" },
    { img: "imagens/cap1/pagina24.webp" },
    { img: "imagens/cap1/pagina25.webp" },
    { img: "imagens/cap1/pagina26.webp", botao: "cliquecapacitor" },
    { img: "imagens/cap1/pagina27.webp", botao: "cliquesanguedomundo" },
    { img: "imagens/cap1/pagina28.webp" },
    { img: "imagens/cap1/pagina29.webp" },
    { img: "imagens/cap1/pagina30.webp" },
    { img: "imagens/cap1/pagina31.webp" },
    { img: "imagens/cap1/pagina32.webp" }
  ],

  eventosEspeciais: function configurarEventos() {
    // Aqui futuramente você configura o que acontece ao clicar nos botões
    console.log("Eventos dos Batedores configurados (placeholder)");
  }
};
