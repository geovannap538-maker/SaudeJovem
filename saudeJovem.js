
  // ===== NAVIGATION =====
  let currentPage = 'home';

  function navigate(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show target page
    document.getElementById('page-' + page).classList.add('active');
    currentPage = page;

    // Update nav active state
    document.querySelectorAll('[data-page]').forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-page') === page);
    });

    // Close mobile menu
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('mobileMenuBtn').textContent = '☰';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset quiz if navigating away
    if (page === 'quiz') {
      resetQuizView();
    }

    return false;
  }

  function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('mobileMenuBtn');
    const isOpen = menu.classList.toggle('open');
    btn.textContent = isOpen ? '✕' : '☰';
  }

  // ===== QUIZ =====
  const questions = [
    {
      question: "Qual o único método que protege contra gravidez E ISTs ao mesmo tempo?",
      options: ["Pílula anticoncepcional", "Preservativo (camisinha)", "DIU", "Tabelinha"],
      correct: 1,
      explanation: "O preservativo (camisinha masculina ou feminina) é o único método que oferece dupla proteção: contra gravidez e ISTs!"
    },
    {
      question: "Muitas ISTs podem não apresentar sintomas. Essa afirmação é:",
      options: ["Verdadeira", "Falsa", "Apenas para HIV", "Apenas em homens"],
      correct: 0,
      explanation: "Verdadeiro! Muitas ISTs são assintomáticas, por isso a testagem regular é tão importante, mesmo sem sintomas aparentes."
    },
    {
      question: "Onde você pode conseguir preservativos gratuitamente?",
      options: ["Apenas em farmácias", "Apenas em hospitais", "Nas Unidades Básicas de Saúde (UBS)", "Não existe distribuição gratuita"],
      correct: 2,
      explanation: "As UBS distribuem preservativos gratuitamente, sem necessidade de receita ou cadastro. É um direito seu!"
    },
    {
      question: "A pílula do dia seguinte deve ser usada como:",
      options: ["Método contraceptivo regular", "Apenas em emergências", "Todos os dias", "Não funciona"],
      correct: 1,
      explanation: "A anticoncepção de emergência (pílula do dia seguinte) é para situações de emergência, não deve ser usada regularmente. Procure um método contraceptivo adequado na UBS."
    },
    {
      question: "Qual vacina disponível no SUS ajuda a prevenir uma IST?",
      options: ["Vacina da gripe", "Vacina do HPV", "Vacina da dengue", "Não existe vacina para ISTs"],
      correct: 1,
      explanation: "A vacina contra o HPV está disponível gratuitamente no SUS para jovens e ajuda a prevenir essa IST que pode causar verrugas e até câncer."
    },
    {
      question: "Se eu tiver uma relação sexual desprotegida, devo:",
      options: ["Esperar sintomas aparecerem", "Fazer testagem para ISTs", "Não fazer nada", "Tomar antibiótico por conta própria"],
      correct: 1,
      explanation: "O ideal é fazer testagem para ISTs após relação desprotegida, mesmo sem sintomas. Procure uma UBS para orientação e testes gratuitos."
    },
    {
      question: "A gravidez na adolescência pode trazer consequências:",
      options: ["Apenas físicas", "Apenas emocionais", "Físicas, emocionais, sociais e educacionais", "Nenhuma consequência"],
      correct: 2,
      explanation: "A gravidez na adolescência pode impactar diversos aspectos da vida: saúde física e emocional, relações sociais e trajetória educacional."
    },
    {
      question: "HIV/AIDS tem cura?",
      options: ["Sim, com antibióticos", "Não tem cura, mas tem tratamento", "Sim, com vacina", "Não tem tratamento"],
      correct: 1,
      explanation: "O HIV não tem cura, mas tem tratamento gratuito pelo SUS que permite que a pessoa viva com qualidade. Quanto antes diagnosticar, melhor!"
    }
  ];

  let currentQ = 0;
  let score = 0;
  let answered = false;

  function resetQuizView() {
    document.getElementById('quiz-start').style.display = 'flex';
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'none';
  }

  function startQuiz() {
    currentQ = 0;
    score = 0;
    answered = false;

    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';

    renderQuestion();
  }

  function renderQuestion() {
    answered = false;
    const q = questions[currentQ];

    document.getElementById('q-counter').textContent = `Questão ${currentQ + 1} de ${questions.length}`;
    document.getElementById('q-score').textContent = `Pontuação: ${score}/${currentQ}`;
    document.getElementById('q-num').textContent = currentQ + 1;
    document.getElementById('q-text').textContent = q.question;

    const pct = (currentQ / questions.length) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';

    const container = document.getElementById('answers-container');
    container.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.innerHTML = `<span>${opt}</span><span class="answer-icon" id="icon-${i}"></span>`;
      btn.onclick = () => selectAnswer(i);
      container.appendChild(btn);
    });

    document.getElementById('explanation-container').style.display = 'none';
  }

  function selectAnswer(idx) {
    if (answered) return;
    answered = true;

    const q = questions[currentQ];
    const btns = document.querySelectorAll('.answer-btn');

    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) {
        btn.classList.add('correct');
        document.getElementById('icon-' + i).textContent = '✅';
      } else if (i === idx && i !== q.correct) {
        btn.classList.add('wrong');
        document.getElementById('icon-' + i).textContent = '❌';
      } else {
        btn.classList.add('dimmed');
      }
    });

    if (idx === q.correct) score++;

    document.getElementById('explanation-text').textContent = q.explanation;
    document.getElementById('explanation-container').style.display = 'block';

    const isLast = currentQ >= questions.length - 1;
    document.getElementById('next-btn').innerHTML = isLast
      ? 'Ver Resultado 🏆'
      : 'Próxima Questão →';
  }

  function nextQuestion() {
    if (currentQ < questions.length - 1) {
      currentQ++;
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    document.getElementById('quiz-screen').style.display = 'none';
    const resultDiv = document.getElementById('quiz-result');
    resultDiv.style.display = 'flex';

    const pct = Math.round((score / questions.length) * 100);
    document.getElementById('result-score').textContent = `${score}/${questions.length}`;
    document.getElementById('result-percent').textContent = `Você acertou ${pct}% das questões`;

    let icon, title, message, bg;
    if (pct >= 75) {
      icon = '🏆'; title = 'Parabéns! Você arrasou! 🎉'; bg = 'linear-gradient(135deg,#10b981,#059669)';
      message = 'Você demonstra ter ótimo conhecimento sobre saúde sexual! Continue compartilhando essas informações com seus amigos e ajudando a conscientizar mais pessoas.';
    } else if (pct >= 50) {
      icon = '⭐'; title = 'Muito bem! Você está no caminho certo! 👏'; bg = 'linear-gradient(135deg,var(--blue),#06b6d4)';
      message = 'Você já tem uma boa base de conhecimento, mas pode aprender ainda mais. Revise as seções sobre Gravidez e ISTs para fortalecer o que você sabe!';
    } else {
      icon = '📚'; title = 'Continue aprendendo! 💪'; bg = 'linear-gradient(135deg,var(--purple),var(--pink))';
      message = 'Não desanime! O importante é que você está buscando conhecimento. Explore as seções de Gravidez e ISTs do site para aprender mais. Conhecimento é poder!';
    }

    const iconEl = document.getElementById('result-icon');
    iconEl.textContent = icon;
    iconEl.style.background = bg;

    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
  }

  // Init nav active state
  document.querySelectorAll('[data-page="home"]').forEach(a => a.classList.add('active'));
