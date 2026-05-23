/**
 * script.js — Alice Fernandes | Site Pessoal
 * =============================================
 * Este arquivo controla todas as interações do site.
 *
 * Índice:
 *  1. Utilitários
 *  2. Menu responsivo (hambúrguer)
 *  3. Header com sombra ao rolar
 *  4. Animações de scroll (Intersection Observer)
 *  5. Destaque do link ativo no menu
 *  6. Filtro de projetos
 *  7. Botão voltar ao topo
 *  8. Validação e envio do formulário de contato
 *  9. Ano atual no rodapé
 * 10. Inicialização
 */


/* =============================================
   1. UTILITÁRIOS
   ============================================= */

/**
 * Seleciona um único elemento do DOM.
 * Equivale a document.querySelector, mas mais curto.
 * @param {string} seletor - Seletor CSS
 * @param {Element} [contexto=document] - Elemento pai para busca
 * @returns {Element|null}
 */
function $(seletor, contexto = document) {
  return contexto.querySelector(seletor);
}

/**
 * Seleciona múltiplos elementos do DOM.
 * Retorna um Array (não NodeList) para facilitar o uso de métodos como .forEach.
 * @param {string} seletor - Seletor CSS
 * @param {Element} [contexto=document] - Elemento pai para busca
 * @returns {Element[]}
 */
function $$(seletor, contexto = document) {
  return Array.from(contexto.querySelectorAll(seletor));
}


/* =============================================
   2. MENU RESPONSIVO (HAMBÚRGUER)
   ============================================= */

/**
 * Controla a abertura e fechamento do menu mobile.
 * Ao clicar no botão hambúrguer, adiciona/remove a classe "aberto"
 * no menu e no próprio botão (para animar as barras em X).
 */
function iniciarMenuResponsivo() {
  const btnToggle = $('#menuToggle');   // Botão hambúrguer
  const navMenu   = $('#navMenu');      // Menu de navegação

  if (!btnToggle || !navMenu) return;  // Sai se os elementos não existirem

  // Alterna o estado do menu ao clicar no botão
  btnToggle.addEventListener('click', function () {
    const estaAberto = navMenu.classList.contains('aberto');

    // Alterna as classes de estado
    navMenu.classList.toggle('aberto');
    btnToggle.classList.toggle('aberto');

    // Atualiza o atributo aria-expanded para acessibilidade
    btnToggle.setAttribute('aria-expanded', String(!estaAberto));
  });

  // Fecha o menu ao clicar em qualquer link de navegação
  $$('.header__nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('aberto');
      btnToggle.classList.remove('aberto');
      btnToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Fecha o menu ao clicar fora dele (em qualquer área da página)
  document.addEventListener('click', function (evento) {
    const clicouFora = !navMenu.contains(evento.target) && !btnToggle.contains(evento.target);
    if (clicouFora && navMenu.classList.contains('aberto')) {
      navMenu.classList.remove('aberto');
      btnToggle.classList.remove('aberto');
      btnToggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* =============================================
   3. HEADER COM SOMBRA AO ROLAR
   ============================================= */

/**
 * Adiciona uma sombra suave ao header quando o usuário
 * rola a página para baixo, criando efeito de profundidade.
 */
function iniciarHeaderScroll() {
  const header = $('.header');
  if (!header) return;

  // Usa scroll passivo para melhor performance
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });
}


/* =============================================
   4. ANIMAÇÕES DE SCROLL (INTERSECTION OBSERVER)
   ============================================= */

/**
 * Usa a API IntersectionObserver para detectar quando elementos
 * com a classe "reveal" entram na viewport e adiciona a classe
 * "visivel", que dispara a animação CSS de fade-in + slide-up.
 *
 * Esta abordagem é mais performática do que ouvir o evento scroll
 * e calcular posições manualmente.
 */
function iniciarAnimacoesScroll() {
  // Seleciona todos os elementos que devem ser animados
  const elementosReveal = $$('.reveal');

  if (elementosReveal.length === 0) return;

  // Configuração do observer:
  // threshold: 0.15 = o elemento precisa ter 15% visível para disparar
  // rootMargin: antecipa um pouco a animação antes do elemento entrar totalmente
  const opcoes = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  // Cria o observer
  const observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        // Adiciona a classe que dispara a animação CSS
        entrada.target.classList.add('visivel');
        // Para de observar o elemento após animá-lo (economia de recursos)
        observer.unobserve(entrada.target);
      }
    });
  }, opcoes);

  // Começa a observar cada elemento
  elementosReveal.forEach(function (elemento) {
    observer.observe(elemento);
  });
}


/* =============================================
   5. DESTAQUE DO LINK ATIVO NO MENU
   ============================================= */

/**
 * Usa IntersectionObserver para detectar qual seção está visível
 * e adiciona a classe "ativo" ao link correspondente no menu.
 * Isso cria uma navegação com indicador visual de posição.
 */
function iniciarLinkAtivo() {
  const secoes = $$('section[id]');          // Todas as seções com ID
  const linksMenu = $$('.header__nav-link'); // Links do menu

  if (secoes.length === 0 || linksMenu.length === 0) return;

  const opcoes = {
    threshold: 0.4, // Seção precisa estar 40% visível
    rootMargin: '-70px 0px 0px 0px' // Compensa o header fixo
  };

  const observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        const idSecao = entrada.target.id;

        // Remove a classe "ativo" de todos os links
        linksMenu.forEach(function (link) {
          link.classList.remove('ativo');
        });

        // Adiciona "ativo" ao link que corresponde à seção visível
        const linkAtivo = linksMenu.find(function (link) {
          return link.getAttribute('href') === '#' + idSecao;
        });

        if (linkAtivo) {
          linkAtivo.classList.add('ativo');
        }
      }
    });
  }, opcoes);

  secoes.forEach(function (secao) {
    observer.observe(secao);
  });
}


/* =============================================
   6. FILTRO DE PROJETOS
   ============================================= */

/**
 * Filtra os cards de projetos com base na categoria selecionada.
 * Ao clicar em um botão de filtro:
 *  - Atualiza o botão ativo visualmente
 *  - Mostra apenas os cards da categoria selecionada
 *  - "Todos" mostra todos os cards
 *
 * A animação de entrada/saída é feita via CSS (classe "oculto").
 */
function iniciarFiltroProjetos() {
  const botoesFiltro = $$('.filtro-btn');  // Botões de filtro
  const cardsProjeto = $$('.projeto__card'); // Cards de projeto

  if (botoesFiltro.length === 0 || cardsProjeto.length === 0) return;

  botoesFiltro.forEach(function (botao) {
    botao.addEventListener('click', function () {
      const filtroSelecionado = botao.getAttribute('data-filtro');

      // --- Atualiza o botão ativo ---
      botoesFiltro.forEach(function (btn) {
        btn.classList.remove('filtro-btn--ativo');
      });
      botao.classList.add('filtro-btn--ativo');

      // --- Filtra os cards ---
      cardsProjeto.forEach(function (card) {
        const categoriaCard = card.getAttribute('data-categoria');

        if (filtroSelecionado === 'todos' || categoriaCard === filtroSelecionado) {
          // Mostra o card
          card.classList.remove('oculto');
          // Pequeno delay para a animação de fade funcionar
          setTimeout(function () {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          // Oculta o card
          card.classList.add('oculto');
        }
      });
    });
  });
}


/* =============================================
   7. BOTÃO VOLTAR AO TOPO
   ============================================= */

/**
 * Exibe o botão "Voltar ao topo" quando o usuário
 * rola mais de 400px para baixo.
 * Ao clicar, rola suavemente de volta ao início da página.
 */
function iniciarBotaoTopo() {
  const btnTopo = $('#btnTopo');
  if (!btnTopo) return;

  // Controla a visibilidade do botão ao rolar
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btnTopo.removeAttribute('hidden');
      // Pequeno delay para a transição CSS funcionar após remover hidden
      setTimeout(function () {
        btnTopo.classList.add('visivel');
      }, 10);
    } else {
      btnTopo.classList.remove('visivel');
      // Aguarda a transição antes de esconder completamente
      setTimeout(function () {
        if (window.scrollY <= 400) {
          btnTopo.setAttribute('hidden', '');
        }
      }, 350);
    }
  }, { passive: true });

  // Rola para o topo ao clicar
  btnTopo.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


/* =============================================
   8. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
   ============================================= */

/**
 * Valida os campos do formulário antes do envio.
 * Como este site é estático (sem backend), o formulário
 * simula um envio bem-sucedido com feedback visual.
 *
 * Para integrar com um backend real, substitua a função
 * simularEnvio() por uma chamada fetch() para sua API.
 */
function iniciarFormularioContato() {
  const form = $('#contatoForm');
  if (!form) return;

  // Referências aos campos
  const campoNome     = $('#nome');
  const campoEmail    = $('#email');
  const campoAssunto  = $('#assunto');
  const campoMensagem = $('#mensagem');
  const feedback      = $('#formFeedback');

  // Referências às mensagens de erro
  const erroNome     = $('#nomeErro');
  const erroEmail    = $('#emailErro');
  const erroAssunto  = $('#assuntoErro');
  const erroMensagem = $('#mensagemErro');

  /**
   * Exibe uma mensagem de erro em um campo.
   * @param {Element} campo - O input/textarea/select
   * @param {Element} elementoErro - O span de erro
   * @param {string} mensagem - Texto do erro
   */
  function mostrarErro(campo, elementoErro, mensagem) {
    campo.classList.add('erro');
    elementoErro.textContent = mensagem;
  }

  /**
   * Limpa o erro de um campo.
   * @param {Element} campo
   * @param {Element} elementoErro
   */
  function limparErro(campo, elementoErro) {
    campo.classList.remove('erro');
    elementoErro.textContent = '';
  }

  /**
   * Valida o formato de um endereço de e-mail.
   * @param {string} email
   * @returns {boolean}
   */
  function emailValido(email) {
    // Expressão regular simples para validação de e-mail
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Valida todos os campos do formulário.
   * @returns {boolean} - true se todos os campos são válidos
   */
  function validarFormulario() {
    let valido = true;

    // Valida o nome (mínimo 2 caracteres)
    if (campoNome.value.trim().length < 2) {
      mostrarErro(campoNome, erroNome, 'Por favor, informe seu nome.');
      valido = false;
    } else {
      limparErro(campoNome, erroNome);
    }

    // Valida o e-mail
    if (!emailValido(campoEmail.value.trim())) {
      mostrarErro(campoEmail, erroEmail, 'Por favor, informe um e-mail válido.');
      valido = false;
    } else {
      limparErro(campoEmail, erroEmail);
    }

    // Valida o assunto (select)
    if (!campoAssunto.value) {
      mostrarErro(campoAssunto, erroAssunto, 'Por favor, selecione um assunto.');
      valido = false;
    } else {
      limparErro(campoAssunto, erroAssunto);
    }

    // Valida a mensagem (mínimo 10 caracteres)
    if (campoMensagem.value.trim().length < 10) {
      mostrarErro(campoMensagem, erroMensagem, 'Sua mensagem precisa ter pelo menos 10 caracteres.');
      valido = false;
    } else {
      limparErro(campoMensagem, erroMensagem);
    }

    return valido;
  }

  /**
   * Simula o envio do formulário (sem backend).
   * Em um projeto real, substitua por uma chamada fetch() para sua API.
   * @param {HTMLButtonElement} btnEnviar - Botão de envio
   */
  function simularEnvio(btnEnviar) {
    // Desabilita o botão e mostra estado de carregamento
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    // Simula um delay de rede (1.5 segundos)
    setTimeout(function () {
      // Exibe mensagem de sucesso
      feedback.removeAttribute('hidden');
      feedback.className = 'form__feedback form__feedback--sucesso';
      feedback.textContent = '✨ Mensagem enviada! Responderei em breve com muito carinho.';

      // Limpa o formulário
      form.reset();

      // Restaura o botão
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar mensagem';

      // Esconde o feedback após 6 segundos
      setTimeout(function () {
        feedback.setAttribute('hidden', '');
        feedback.textContent = '';
      }, 6000);

    }, 1500);
  }

  // Evento de submissão do formulário
  form.addEventListener('submit', function (evento) {
    // Impede o comportamento padrão (recarregar a página)
    evento.preventDefault();

    // Valida antes de enviar
    if (!validarFormulario()) {
      // Foca no primeiro campo com erro para acessibilidade
      const primeiroCampoComErro = form.querySelector('.erro');
      if (primeiroCampoComErro) {
        primeiroCampoComErro.focus();
      }
      return;
    }

    // Se válido, simula o envio
    const btnEnviar = form.querySelector('[type="submit"]');
    simularEnvio(btnEnviar);
  });

  // Limpa erros em tempo real enquanto o usuário digita
  [campoNome, campoEmail, campoAssunto, campoMensagem].forEach(function (campo) {
    campo.addEventListener('input', function () {
      if (campo.classList.contains('erro')) {
        campo.classList.remove('erro');
        // Limpa a mensagem de erro correspondente
        const idErro = campo.id + 'Erro';
        const elementoErro = $('#' + idErro);
        if (elementoErro) elementoErro.textContent = '';
      }
    });
  });
}


/* =============================================
   9. ANO ATUAL NO RODAPÉ
   ============================================= */

/**
 * Insere o ano atual no rodapé automaticamente.
 * Assim, o copyright sempre estará atualizado sem edição manual.
 */
function inserirAnoAtual() {
  const elementoAno = $('#anoAtual');
  if (elementoAno) {
    elementoAno.textContent = new Date().getFullYear();
  }
}


/* =============================================
   10. INICIALIZAÇÃO
   ============================================= */

/**
 * Inicializa todas as funcionalidades quando o DOM estiver pronto.
 * O evento DOMContentLoaded garante que o HTML foi completamente
 * carregado antes de tentarmos acessar os elementos.
 */
document.addEventListener('DOMContentLoaded', function () {

  // Inicia cada funcionalidade
  iniciarMenuResponsivo();      // Menu hambúrguer mobile
  iniciarHeaderScroll();        // Sombra no header ao rolar
  iniciarAnimacoesScroll();     // Fade-in dos elementos ao rolar
  iniciarLinkAtivo();           // Destaque do link ativo no menu
  iniciarFiltroProjetos();      // Filtro de categorias nos projetos
  iniciarBotaoTopo();           // Botão voltar ao topo
  iniciarFormularioContato();   // Validação do formulário
  inserirAnoAtual();            // Ano no rodapé

  console.log('✨ Site da Alice Fernandes carregado com sucesso!');
});
