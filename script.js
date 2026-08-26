const $=x=>document.getElementById(x),palavras={
facil:['casa','jogo','livro','amigo','escola','codigo','robot','pizza','bolo','arroz','gato','cachorro','planeta','estrela','lapis','caneta','praia','jardim','banana','queijo'],
medio:['algoritmo','programacao','inteligencia','informacao','comunicacao','computacao','criptografia','engenharia','astronomia','laboratorio','experimento','matematica','estatistica','geometria','ecossistema','civilizacao','democracia','diversidade','patrimonio','cartografia','sustentabilidade','arqueologia','dicionario','interpretacao','criatividade','imaginacao','literatura','biblioteca','aprendizagem','curiosidade','responsabilidade','colaboracao','investigacao','raciocinio','conhecimento','biodiversidade','constelacao','atmosfera','temperatura','vegetacao','decodificador','transmissao','sequencia','combinacao','codificacao','decifracao','pontuacao','multiplicador','algoritmo inteligente','codigo misterioso','planeta distante','biblioteca digital','mensagem secreta','ciencia divertida','tecnologia criativa','sistema complexo','universo infinito','futuro sustentavel','robot curioso','descoberta importante','matematica aplicada','floresta tropical','sinal desconhecido'],
dificil:['o algoritmo encontrou respostas','a tecnologia muda tudo','decodifique a mensagem secreta','o universo guarda misterios','aprender codigo e divertido','a ciencia explica fenomenos','nosso planeta precisa cuidado','o robot encontrou um sinal','computadores processam informacoes rapidamente','a biblioteca possui muitos livros','descubra a combinacao correta','o sistema binario funciona assim','a comunicacao digital usa bits','conhecimento transforma nosso futuro','a criatividade resolve problemas complexos','explore os misterios da galaxia','a sustentabilidade protege o planeta','cada sequencia guarda informacoes','a matematica aparece em tudo','tecnologia e ciencia trabalham juntas']};
const tabela=Object.fromEntries([... 'abcdefghijklmnopqrstuvwxyz'].map(l=>[l,l.charCodeAt().toString(2).padStart(8,'0')]));tabela[' ']='00100000';
const e={menu:$('menu'),jogo:$('jogo'),carregamento:$('carregamento'),derrota:$('derrota'),resumoDerrota:$('resumoDerrota'),novo:$('jogarNovamente'),menuDerrota:$('menuDerrota'),placarDerrota:$('placarDerrota'),textoCarregamento:$('textoCarregamento'),nome:$('nomeJogador'),senha:$('senhaConta'),confirmar:$('confirmarSenha'),nomeEntrar:$('nomeEntrar'),senhaEntrar:$('senhaEntrar'),criar:$('criarContaBotao'),mostrarEntrar:$('mostrarEntrar'),mostrarCriar:$('mostrarCriar'),criarArea:$('criarConta'),entrarArea:$('entrarConta'),mensagem:$('mensagemConta'),entrar:$('entrarJogo'),placar:$('abrirPlacar'),como:$('abrirComo'),audioMenu:$('audioMenu'),audioJogo:$('audioJogo'),decoracoes:$('decoracoesMenu'),topo:$('jogadorTopo'),voltar:$('voltarMenu'),codigo:$('codigoBinario'),resp:$('resposta'),form:$('formResposta'),dica:$('botaoDica'),feedback:$('feedback'),nivel:$('nivelTexto'),pontos:$('pontos'),vidas:$('vidas'),seq:$('sequencia'),multi:$('multiplicador'),fala:$('falaRobo'),robo:$('robo'),lista:$('listaDescobertas'),alfa:$('botaoAlfabeto'),alfaC:$('conteudoAlfabeto'),tabela:$('tabelaAlfabeto'),sinal:$('botaoSinal'),codSinal:$('codigoSecreto'),formSinal:$('formSinal'),respSinal:$('respostaSinal'),resSinal:$('resultadoSinal'),estado:$('estadoMissao'),modal:$('modal'),modalC:$('conteudoModal'),fechar:$('fecharModal'),aviso:$('avisoFase'),subAviso:$('subAviso'),volume:$('volumeGeral'),valor:$('valorVolume'),musica:$('botaoMusica'),efeitos:$('botaoEfeitos'),voz:$('botaoVoz')};
let jogador=localStorage.getItem('binoJogador')||'',pontos=0,vidas=3,sequencia=0,melhorSequencia=0,atual='',ultimo='',dicas=0,missao=null,ctx,master,efeitos=true,voz=true,ligada=false,temporizador,temporizadorFala,temporizadorCodigo,fraseAtual='',indiceFala=0,estadoTela='menu',partidaEncerrada=false,niveisRecentes=[],perguntasDaPartida=0,temporizadoresMenu=[];
e.musicaMenu={textContent:'',onclick:null};
function binario(t){return [...t].map(x=>tabela[x]).join(' ')}function limpar(x){return x.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function ocultarTodasAsTelas(){[e.menu,e.jogo,e.carregamento,e.derrota].forEach(t=>t.hidden=true);window.scrollTo(0,0)}
function ajustarRolagem(){document.body.classList.toggle('sem-rolagem',estadoTela==='carregamento')}
function mostrarMenu(){estadoTela='menu';ocultarTodasAsTelas();e.menu.hidden=false;ajustarRolagem();pausarFaixa(e.audioJogo);if(ligada)tocarFaixa(e.audioMenu);criarDecoracoesMenu()}
function mostrarCarregamento(){estadoTela='carregamento';ocultarTodasAsTelas();e.carregamento.hidden=false;ajustarRolagem();limparDecoracoesMenu()}
function atualizarEstadoMusica(){ligada=!e.audioJogo.paused;e.musica.textContent=`MÚSICA: ${ligada?'LIGADA':'DESLIGADA'}`}
function mostrarJogo(){estadoTela='jogo';ocultarTodasAsTelas();e.jogo.hidden=false;ajustarRolagem();if(ligada)tocarFaixa(e.audioJogo);setTimeout(atualizarEstadoMusica,180)}
function tocarFaixa(faixa){const outra=faixa===e.audioMenu?e.audioJogo:e.audioMenu;pausarFaixa(outra);faixa.volume=0;faixa.play().then(()=>fadeAudio(faixa,.18,800)).catch(()=>{e.feedback&&(e.feedback.textContent='Clique em MÚSICA para ativar a trilha sonora.')})}
function pausarFaixa(faixa){fadeAudio(faixa,0,350,()=>{faixa.pause();faixa.currentTime=0})}
function fadeAudio(faixa,alvo,ms,finalizar){const inicio=faixa.volume,passos=18,delta=(alvo-inicio)/passos;let i=0;const id=setInterval(()=>{faixa.volume=Math.max(0,Math.min(1,faixa.volume+delta));if(++i>=passos){clearInterval(id);faixa.volume=alvo;if(finalizar)finalizar()}},ms/passos)}
function criarDecoracoesMenu(){if(e.decoracoes.childElementCount)return;const guia=document.createElement('div');guia.className='guia-menu';guia.innerHTML='<div class="bino-menu-grande"><span></span><span></span><b></b></div><div id="falaMenuBino" class="fala-menu-bino">Oi! Eu sou o B.I.N.O. Vamos decifrar mensagens juntos?</div>';e.menu.querySelector('.menu-cartao').before(guia);['0','1','01','10','001','101','0','1'].forEach((bit,i)=>{const x=document.createElement('i');x.className='bit-solto';x.textContent=bit;x.style.left=`${Math.random()*92}%`;x.style.top=`${Math.random()*90}%`;x.style.setProperty('--d',`${6+i%5}s`);e.decoracoes.append(x)});const surgir=tipo=>{if(estadoTela!=='menu')return;const x=document.createElement('i');x.className=tipo;x.style.top=`${10+Math.random()*74}%`;if(Math.random()>.5){x.style.left='auto';x.style.right='-45px';x.style.transform='scaleX(-1)'}e.decoracoes.append(x);setTimeout(()=>x.remove(),tipo==='nave-menu'?4500:6500);temporizadoresMenu.push(setTimeout(()=>surgir(tipo),8000+Math.random()*12000))};surgir('robo-espreita');surgir('nave-menu')}
function limparDecoracoesMenu(){temporizadoresMenu.forEach(clearTimeout);temporizadoresMenu=[];e.decoracoes.innerHTML='';e.menu.querySelector('.guia-menu')?.remove()}
function audio(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination)}ctx.resume()}
function tom(n,d=.1,t='square',v=.06,a=0,forcar=false){if(!efeitos&&!forcar||!ctx)return;let o=ctx.createOscillator(),g=ctx.createGain(),i=ctx.currentTime+a;o.type=t;o.frequency.value=n;g.gain.setValueAtTime(.001,i);g.gain.exponentialRampToValueAtTime(v,i+.01);g.gain.exponentialRampToValueAtTime(.001,i+d);o.connect(g).connect(master);o.start(i);o.stop(i+d+.03)}
function clique(){audio();tom(560,.05)}
function bipBino(letra){if(!voz||!efeitos||letra===' '||!/[a-zà-ú0-9]/i.test(letra))return;audio();tom(510+(letra.charCodeAt(0)%7)*38,.026,'square',.018)}
function mostrarCodigoGradual(codigo){clearTimeout(temporizadorCodigo);e.codigo.textContent='';let i=0;const escrever=()=>{if(i>=codigo.length)return;const caractere=codigo[i++];e.codigo.textContent+=caractere;if(caractere==='0'||caractere==='1'){audio();tom(420+(i%6)*34,.018,'square',.012)}temporizadorCodigo=setTimeout(escrever,caractere===' '?42:24)};escrever()}
function concluirFala(){clearTimeout(temporizadorFala);e.fala.textContent=fraseAtual;e.robo.classList.remove('falando');indiceFala=fraseAtual.length}
function expressaoBino(tipo,duracao=900){e.robo.classList.remove('feliz','confuso','preocupado','surpreso','pensativo','orgulhoso','sonolento');if(tipo)e.robo.classList.add(tipo);if(duracao)setTimeout(()=>e.robo.classList.remove(tipo),duracao)}
function falar(t){clearTimeout(temporizadorFala);fraseAtual=t;indiceFala=0;e.fala.textContent='';e.robo.classList.add('falando');const escrever=()=>{if(indiceFala>=fraseAtual.length){e.robo.classList.remove('falando');return}const letra=fraseAtual[indiceFala++];e.fala.textContent+=letra;bipBino(letra);temporizadorFala=setTimeout(escrever,letra===' ' ? 42 : /[.!?,:]/.test(letra) ? 72 : 28)};escrever()}
function musica(){audio();if(temporizador)return;let notas=[262,330,392,330,294,349,440,349],i=0;let tocar=()=>{if(!ligada)return;let o=ctx.createOscillator(),g=ctx.createGain();o.type='square';o.frequency.value=notas[i++%notas.length]/2;g.gain.setValueAtTime(.001,ctx.currentTime);g.gain.linearRampToValueAtTime(.025,ctx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.28);o.connect(g).connect(master);o.start();o.stop(ctx.currentTime+.3);temporizador=setTimeout(tocar,360)};tocar()}
function atualizar(){e.pontos.textContent=String(pontos).padStart(3,'0');e.vidas.textContent='♥ '.repeat(vidas)+'♡ '.repeat(3-vidas);e.seq.textContent=sequencia;e.multi.textContent=`x${sequencia>=4?3:sequencia>=2?2:1}`}
function dificuldade(){if(perguntasDaPartida<3)return'facil';const opcoes=['facil','medio','dificil'].filter(n=>niveisRecentes.slice(-2).filter(x=>x===n).length<2);const nivel=opcoes[Math.floor(Math.random()*opcoes.length)];niveisRecentes.push(nivel);return nivel}function gerarPuzzleAleatorio(){let nivel=dificuldade(),lista=palavras[nivel].filter(t=>{let n=t.split(' ').length;return nivel==='facil'?n===1:nivel==='medio'?n>=2&&n<=3:n>=3&&n<=4}),opcoes=lista.filter(x=>x!==ultimo);atual=opcoes[Math.floor(Math.random()*opcoes.length)];ultimo=atual;perguntasDaPartida++;dicas=0;mostrarCodigoGradual(binario(atual));e.resp.value='';e.nivel.textContent=nivel.toUpperCase();e.feedback.textContent='Decifre a mensagem usando o alfabeto abaixo.';e.resp.focus();if(sequencia&&sequencia%5===0&&!missao)liberarTransmissaoOculta()}
function iniciarJogo(){jogador=limpar(e.nome.value)||jogador;if(!jogador){e.nome.focus();return}clique();localStorage.setItem('binoJogador',jogador);e.topo.textContent=jogador;pontos=0;vidas=3;sequencia=0;melhorSequencia=0;missao=null;perguntasDaPartida=0;niveisRecentes=[];partidaEncerrada=false;e.lista.innerHTML='<p class="vazio">Suas descobertas aparecerão aqui.</p>';e.codSinal.textContent='Avance cinco acertos para detectar um sinal.';e.estado.textContent='BÔNUS';atualizar();gerarPuzzleAleatorio();pausarFaixa(e.audioMenu);mostrarCarregamento();const mensagens=['PREPARANDO TRANSMISSÃO...','CONECTANDO AO SISTEMA BINÁRIO...','B.I.N.O. ESTÁ CALIBRANDO OS SENSORES...'];let i=0;const ciclo=setInterval(()=>{e.textoCarregamento.textContent=mensagens[++i%mensagens.length]},650);setTimeout(()=>{clearInterval(ciclo);mostrarJogo();expressaoBino('surpreso');falar(falaAleatoria('inicio'))},2300)}
function registrar(t){let x=document.createElement('div');x.className='descoberta';x.innerHTML=`<code>${binario(t)}</code> → <strong>${t}</strong>`;let v=e.lista.querySelector('.vazio');if(v)v.remove();e.lista.prepend(x)}
const falas={inicio:['Oi! Eu sou o B.I.N.O. Vamos decifrar mensagens juntos?','Ola, decodificador! Sua proxima descoberta comeca aqui.','Meus sensores estao prontos para uma nova aventura binaria!','Zero e um podem esconder coisas incriveis. Vamos descobrir?','Bem-vindo ao centro de transmissoes digitais!'],acerto:['Codigo decifrado! Excelente trabalho!','Perfeito! Voce encontrou a mensagem escondida.','Muito bem! Os bits fizeram sentido.','Incrivel! Continue assim, decodificador.','Acerto confirmado. Sua sequencia esta aumentando!'],erro:['Quase! Observe cada grupo de oito bits.','Um pequeno erro nao interrompe a missao.','Voce consegue! Cada tentativa ensina algo novo.','Essa transmissao ainda nao esta correta.'],vida:['Uma vida foi perdida, mas a missao continua.','Ainda temos chances. Continue decodificando!','Nao se preocupe, eu ainda acredito em voce.','Transmissao instavel, mas podemos recuperar.'],dica:['Vou deixar uma pista. Use seus sensores com cuidado!','Dica enviada. Analise a sequencia com calma.'],pular:['Tudo bem! Vamos procurar uma sequencia que combine mais com voce.','Pular tambem pode fazer parte da estrategia.','Nova sequencia a caminho. Continue tentando!','Voce nao desistiu, apenas escolheu outro desafio.','A missao continua! Vamos para outra transmissao.'],semDica:['Ainda precisamos de mais pontos para acessar essa dica.','Vamos conquistar alguns pontos antes de pedir ajuda.','Dica bloqueada por enquanto. Voce consegue tentar sozinho!'],semPular:['Ainda nao temos pontos suficientes para trocar esta sequencia.','Precisamos de 125 pontos para pular. Tente decifrar este sinal!','A reserva de pontos esta baixa, mas eu acredito em voce.','Pular exige energia digital. Conquiste mais pontos primeiro!'],fim:['A transmissao foi encerrada, mas voce aprendeu muito.','Voce chegou longe. Vamos voltar ainda mais preparados.']};let ultimaFala={};function falaAleatoria(tipo){let a=falas[tipo],op=a.filter(x=>x!==ultimaFala[tipo]);let x=op[Math.floor(Math.random()*op.length)];ultimaFala[tipo]=x;return x}
function verificarResposta(){if(partidaEncerrada)return;clique();if(limpar(e.resp.value)!==atual){perderVida();return}let m=sequencia>=4?3:sequencia>=2?2:1;sequencia++;melhorSequencia=Math.max(melhorSequencia,sequencia);pontos+=100*m;audio();[520,740,1040].forEach((n,i)=>tom(n,.15,'sine',.08,i*.1));e.robo.classList.add('comemorando');expressaoBino(sequencia>=5?'orgulhoso':'feliz');registrar(atual);e.feedback.className='acerto';e.feedback.textContent=`Correto! +${100*m} pontos`;falar(falaAleatoria('acerto'));atualizar();setTimeout(()=>{e.robo.classList.remove('comemorando');gerarPuzzleAleatorio()},700)}
function perderVida(){if(partidaEncerrada)return;audio();tom(210,.15,'triangle');tom(170,.13,'sine',.05,.1);vidas--;sequencia=0;e.robo.classList.add('triste');expressaoBino(vidas?'preocupado':'confuso');e.feedback.className='erro';e.feedback.textContent='Resposta incorreta. Você perdeu uma vida.';falar(vidas?falaAleatoria('vida'):falaAleatoria('fim'));atualizar();if(!vidas){partidaEncerrada=true;setTimeout(finalizarPartida,800)}else setTimeout(()=>{e.robo.classList.remove('triste');gerarPuzzleAleatorio()},700)}
const dicasContextuais={algoritmo:'E uma sequencia de instrucoes usada para resolver um problema.',galaxia:'E um enorme conjunto de estrelas, planetas e poeira no universo.',biblioteca:'E um lugar fisico ou digital onde encontramos livros e conhecimento.',criptografia:'E usada para proteger mensagens e informacoes.',pizza:'E uma comida redonda muito popular, geralmente com queijo.',cachorro:'E um animal domestico conhecido por ser amigo das pessoas.',programacao:'E a criacao de instrucoes para computadores.',inteligencia:'Esta ligada a capacidade de aprender, compreender e resolver problemas.',computacao:'E a area que estuda computadores e processamento de informacoes.',astronomia:'E a ciencia que estuda o universo e os corpos celestes.',matematica:'E a area do conhecimento que trabalha com numeros, formas e raciocinio.',ecossistema:'E a relacao entre seres vivos e o ambiente onde vivem.',democracia:'E uma forma de organizacao social baseada na participacao das pessoas.',sustentabilidade:'E cuidar do presente sem prejudicar o futuro do planeta.',dicionario:'E uma obra usada para consultar palavras e seus significados.',criatividade:'E a capacidade de imaginar e criar novas ideias.',biodiversidade:'E a variedade de seres vivos existentes em um ambiente.',constelacao:'E um grupo aparente de estrelas no ceu.',transmissao:'E o envio de uma mensagem ou sinal de um lugar para outro.',decodificador:'E algo que transforma um codigo em uma mensagem compreensivel.',pontuacao:'E a quantidade de pontos conquistados durante a partida.',robot:'E uma maquina criada para realizar tarefas.',planeta:'E um corpo celeste que gira ao redor de uma estrela.',floresta:'E uma grande area com muitas arvores e vida natural.',oceano:'E uma enorme extensao de agua salgada.','o sistema binario funciona assim':'A frase fala sobre a linguagem formada pelos numeros zero e um.','a tecnologia muda tudo':'A frase trata de como inovacoes podem transformar a vida das pessoas.','decodifique a mensagem secreta':'A frase convida voce a descobrir uma informacao escondida.','a comunicacao digital usa bits':'A frase fala sobre mensagens enviadas por meio de zeros e uns.','conhecimento transforma nosso futuro':'A frase destaca a importancia de aprender para construir o amanha.'};
function dicaContextual(){if(dicasContextuais[atual])return dicasContextuais[atual];if(atual.includes(' '))return 'A pista esta no tema geral da frase. Leia todos os grupos de oito bits e monte as palavras com calma.';if(['pizza','hamburguer','macarrao','chocolate','sorvete'].includes(atual))return 'E uma palavra relacionada a comida.';if(['cachorro','gato','leao','tigre','elefante','passaro'].includes(atual))return 'E o nome de um animal.';if(['algoritmo','programacao','computacao','criptografia','ciberseguranca','tecnologia'].includes(atual))return 'E uma palavra ligada a ciencia ou tecnologia.';return 'Observe os grupos de oito bits com calma e consulte o Alfabeto Binario para montar a palavra.'}
function pedirDica(){if(pontos<25){e.feedback.className='erro';e.feedback.textContent='Pontos insuficientes para pedir dica.';expressaoBino('preocupado');falar(falaAleatoria('semDica'));return}clique();expressaoBino('pensativo');pontos-=25;dicas++;let t=dicas===1?dicaContextual():dicas===2?`A resposta comeca com a letra “${atual[0]}”.`:`A resposta possui ${atual.replaceAll(' ','').length} letras e ${atual.split(' ').length} palavra(s).`;e.feedback.className='';e.feedback.textContent=`-25 pontos · ${t}`;atualizar();falar(falaAleatoria('dica'))}
function pularSequencia(){if(partidaEncerrada)return;if(pontos<125){e.feedback.className='erro';e.feedback.textContent='Pontos insuficientes para pular esta sequência.';expressaoBino('preocupado');falar(falaAleatoria('semPular'));return}pontos-=125;e.feedback.className='';e.feedback.textContent='-125 pontos · Sequência pulada.';expressaoBino('pensativo');atualizar();falar(falaAleatoria('pular'));gerarPuzzleAleatorio()}
function liberarTransmissaoOculta(){let op=['algoritmo secreto','mensagem digital','codigo misterioso','sistema inteligente','planeta desconhecido','ciencia e futuro','tecnologia criativa','biblioteca digital','universo infinito','o sinal chegou','decodifique esta mensagem','a transmissao e secreta','conhecimento muda tudo','o robot encontrou pistas','tecnologia conecta pessoas','descubra o codigo oculto'];missao=op[Math.floor(Math.random()*op.length)];e.codSinal.textContent=binario(missao);e.estado.textContent='NOVA';audio();[270,350,310,440].forEach((n,i)=>tom(n,.07,'square',.04,i*.11));expressaoBino('surpreso');falar('Uma transmissão oculta apareceu. Ela vale cento e cinquenta pontos extras!')}
function investigar(){if(!missao){e.resSinal.textContent='Nenhum sinal raro detectado ainda.';return}clique();e.formSinal.hidden=false;e.respSinal.focus()}
function verificarSinal(){if(limpar(e.respSinal.value)!==missao){e.resSinal.textContent='Ainda não foi decifrado. Você pode tentar novamente sem perder vidas.';return}pontos+=150;const ganhouVida=vidas<3;if(ganhouVida)vidas++;registrar(`transmissao oculta: ${missao}`);e.resSinal.textContent=`Transmissão decifrada! +150 pontos${ganhouVida?' · +1 coração':''}`;e.formSinal.hidden=true;e.estado.textContent='DECIFRADA';audio();[440,660,880,1040].forEach((n,i)=>tom(n,.12,'sine',.08,i*.09));missao=null;atualizar();falar('Transmissão oculta decifrada. Excelente descoberta!')}
function salvarPlacar(){let lista=JSON.parse(localStorage.getItem('binoPlacar')||'[]'),i=lista.findIndex(x=>x.nome===jogador),anterior=lista[i]||{},r={nome:jogador,pontos:Math.max(pontos,anterior.pontos||0),sequencia:Math.max(melhorSequencia,anterior.sequencia||0),partidas:(anterior.partidas||0)+1,ultimaPartida:new Date().toLocaleDateString('pt-BR')};if(i>=0)lista[i]=r;else lista.push(r);localStorage.setItem('binoPlacar',JSON.stringify(lista))}
function abrirModal(){if(!e.modalC.innerHTML.trim())return;e.modal.hidden=false;e.modal.setAttribute('aria-hidden','false');e.fechar.focus()}
function fecharModal(){e.modal.hidden=true;e.modal.setAttribute('aria-hidden','true')}
function roboMini(){return '<span class="robo-mini" aria-hidden="true"><i></i><i></i></span>'}
function mostrarPerfil(nome){const lista=JSON.parse(localStorage.getItem('binoPlacar')||'[]').sort((a,b)=>b.pontos-a.pontos),p=lista.find(x=>x.nome===nome);if(!p)return;const posicao=lista.indexOf(p)+1;e.modalC.innerHTML=`<h2 id="tituloModal">PERFIL DO JOGADOR</h2><div class="perfil-nome">${roboMini()} <b>${p.nome}</b></div><p><strong>Posição:</strong> ${posicao}º no placar local</p><p><strong>Maior pontuação:</strong> ${p.pontos||0}</p><p><strong>Melhor sequência:</strong> ${p.sequencia||0}</p><p><strong>Partidas realizadas:</strong> ${p.partidas||1}</p><p><strong>Última partida:</strong> ${p.ultimaPartida||'Não registrada'}</p>`;abrirModal()}
function mostrarPlacar(){let lista=JSON.parse(localStorage.getItem('binoPlacar')||'[]').sort((a,b)=>b.pontos-a.pontos);e.modalC.innerHTML=`<h2 id="tituloModal">PLACAR LOCAL</h2><p>Salvo somente neste navegador. Clique em um nome para ver o perfil.</p>${lista.length?`<ol class="ranking">${lista.map(x=>`<li>${roboMini()} <button class="nome-ranking" type="button" data-jogador="${x.nome}">${x.nome}</button><span>${x.pontos} pontos · sequência ${x.sequencia||0} · ${x.partidas||1} partida(s)</span></li>`).join('')}</ol>`:'<p>Nenhuma partida registrada ainda.</p>'}`;abrirModal();e.modalC.querySelectorAll('.nome-ranking').forEach(b=>b.onclick=()=>mostrarPerfil(b.dataset.jogador))}
function finalizarPartida(){if(!partidaEncerrada)return;salvarPlacar();audio();[330,260,196].forEach((n,i)=>tom(n,.24,'triangle',.08,i*.16));fecharModal();estadoTela='derrota';ocultarTodasAsTelas();e.derrota.hidden=false;ajustarRolagem();e.resumoDerrota.textContent=`Pontuação final: ${pontos} · melhor sequência: ${melhorSequencia}`;falar('Fim de jogo. Você foi muito bem! Tente novamente para superar sua pontuação.')}
function renderAlfabeto(){e.tabela.innerHTML=[...'abcdefghijklmnopqrstuvwxyz '].map(l=>`<div class="letra-binaria"><strong>${l===' '?'espaço':l}</strong><code>${tabela[l]}</code></div>`).join('')}
e.entrar.onclick=iniciarJogo;e.form.onsubmit=x=>{x.preventDefault();verificarResposta()};e.dica.onclick=pedirDica;e.sinal.onclick=investigar;e.formSinal.onsubmit=x=>{x.preventDefault();verificarSinal()};e.alfa.onclick=()=>{let a=!e.alfaC.hidden;e.alfaC.hidden=a;e.alfa.setAttribute('aria-expanded',!a)};e.placar.onclick=mostrarPlacar;e.como.onclick=()=>{e.modalC.innerHTML='<h2 id="tituloModal">COMO JOGAR</h2><p>Consulte o alfabeto, decifre a palavra binária e mantenha suas três vidas. Cada acerto aumenta sua sequência e pontuação.</p>';abrirModal()};e.fechar.onclick=fecharModal;e.modal.onclick=x=>{if(x.target===e.modal)fecharModal()};document.addEventListener('keydown',x=>{if(x.key==='Escape'&&!e.modal.hidden)fecharModal();if(x.key==='Enter'&&indiceFala<fraseAtual.length)concluirFala()});e.fala.onclick=concluirFala;e.fala.onkeydown=x=>{if(x.key==='Enter'||x.key===' '){x.preventDefault();concluirFala()}};e.voltar.onclick=()=>{mostrarMenu();falar('Voltamos ao menu. Estarei aqui quando você quiser uma nova missão.')};e.volume.oninput=()=>{audio();master.gain.value=e.volume.value/100;[e.audioMenu,e.audioJogo].forEach(a=>{if(!a.paused)a.volume=Math.min(.25,e.volume.value/100*.25)});e.valor.textContent=`${e.volume.value}%`};function alternarMusica(){ligada=!ligada;e.musica.textContent=`MÚSICA: ${ligada?'LIGADA':'DESLIGADA'}`;e.musicaMenu.textContent=`MÚSICA: ${ligada?'LIGADA':'DESLIGADA'}`;if(ligada){tocarFaixa(estadoTela==='menu'?e.audioMenu:e.audioJogo)}else{pausarFaixa(e.audioMenu);pausarFaixa(e.audioJogo)}}e.musica.onclick=alternarMusica;e.musicaMenu.onclick=alternarMusica;e.efeitos.onclick=()=>{efeitos=!efeitos;e.efeitos.textContent=`EFEITOS: ${efeitos?'LIGADOS':'DESLIGADOS'}`};e.voz.onclick=()=>{voz=!voz;e.voz.textContent=`SOM B.I.N.O.: ${voz?'LIGADO':'DESLIGADO'}`};e.nome.value=jogador;renderAlfabeto();mostrarMenu();
/* B.I.N.O. interativo no menu e carregamento sem transmissao antecipada. */
let temporizadorFalaMenu=0,indiceFalaMenu=0,fraseMenuAtual='',ultimoToqueMenu=0;
const falasMenu={toque:['Yowch!','Owch!','Ei, cuidado!','Pare, minhas engrenagens fazem cosquinha!','Hehe! Isso me surpreendeu.','Meus sensores sentiram isso!','B.I.N.O. ainda esta inteiro!','Clique gentilmente, decodificador!'],criar:['Vamos criar sua identidade digital!','Escolha um nome que combine com um grande decodificador.','Sua conta vai ficar salva neste dispositivo.','Quase pronto para uma nova missao!'],entrar:['Bem-vindo de volta, decodificador!','Vamos verificar seus dados digitais.','Seus sinais parecem familiares.','Preparando o acesso a sua conta.'],placar:['Vamos ver quem dominou mais sequencias!','O placar guarda grandes descobertas.','Talvez seu nome apareca no topo em breve!','Cada ponto conta nessa missao.'],como:['Eu explico tudo! E mais simples do que parece.','Bits, letras e descobertas: esse e o plano.','Use o alfabeto binario como seu mapa.','Vamos transformar zeros e uns em palavras.'],erro:['Hmm... esses dados nao parecem corretos.','Confira o nome e a senha com calma.','Meus sensores encontraram uma pequena falha.','Nada de panico, tente novamente.']};
const ultimaFalaMenu={};
const boasVindasMenu=['Oi! Eu sou o B.I.N.O. Vamos decifrar algo hoje?','Ola, decodificador! Meus sensores estavam esperando por voce.','Bem-vindo ao centro de transmissoes binarias!','Oi! Preparado para transformar bits em descobertas?','Que bom ver voce por aqui! Vamos comecar uma missao?','Saudacoes, decodificador. O sistema esta pronto!','B.I.N.O. online! Qual sera a proxima descoberta?','Oi! Zeros e uns escondem muitas surpresas.'];
let ultimaBoasVindasMenu='',interacaoAudioMenu=false;
function saudarMenu(){const opcoes=boasVindasMenu.filter(f=>f!==ultimaBoasVindasMenu);ultimaBoasVindasMenu=opcoes[Math.floor(Math.random()*opcoes.length)];falarMenu(ultimaBoasVindasMenu)}
function somToqueBinoMenu(){if(!interacaoAudioMenu||!efeitos)return;audio();tom(460,.055,'sine',.035);tom(690,.075,'triangle',.028,.045)}
document.addEventListener('pointerdown',()=>{interacaoAudioMenu=true},{once:true,capture:true});
document.addEventListener('keydown',()=>{interacaoAudioMenu=true},{once:true,capture:true});
function falaMenuAleatoria(tipo){const opcoes=falasMenu[tipo]||falasMenu.toque;const novas=opcoes.filter(f=>f!==ultimaFalaMenu[tipo]);const fala=novas[Math.floor(Math.random()*novas.length)];ultimaFalaMenu[tipo]=fala;return fala}
function concluirFalaMenu(){clearTimeout(temporizadorFalaMenu);const alvo=document.getElementById('falaMenuBino');if(alvo)alvo.textContent=fraseMenuAtual;indiceFalaMenu=fraseMenuAtual.length;document.querySelector('.bino-menu-grande')?.classList.remove('falando-menu')}
function falarMenu(texto){const alvo=document.getElementById('falaMenuBino');if(!alvo)return;clearTimeout(temporizadorFalaMenu);fraseMenuAtual=texto;indiceFalaMenu=0;alvo.textContent='';const roboMenu=document.querySelector('.bino-menu-grande');roboMenu?.classList.add('falando-menu');const escrever=()=>{if(indiceFalaMenu>=fraseMenuAtual.length){roboMenu?.classList.remove('falando-menu');return}const letra=fraseMenuAtual[indiceFalaMenu++];alvo.textContent+=letra;if(interacaoAudioMenu)bipBino(letra);temporizadorFalaMenu=setTimeout(escrever,letra===' '?32:/[,.!?]/.test(letra)?55:26)};escrever()}
function prepararBinoMenu(){const roboMenu=document.querySelector('.bino-menu-grande'),balao=document.getElementById('falaMenuBino');if(!roboMenu||roboMenu.dataset.pronto)return;roboMenu.dataset.pronto='true';roboMenu.setAttribute('role','button');roboMenu.setAttribute('tabindex','0');roboMenu.setAttribute('aria-label','Conversar com B.I.N.O.');if(balao){balao.setAttribute('role','button');balao.setAttribute('tabindex','0');balao.setAttribute('aria-label','Mostrar a fala completa do B.I.N.O.');balao.addEventListener('click',concluirFalaMenu);balao.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();concluirFalaMenu()}})}const reagir=()=>{if(Date.now()-ultimoToqueMenu<450)return;ultimoToqueMenu=Date.now();somToqueBinoMenu();roboMenu.classList.remove('tocando-menu');void roboMenu.offsetWidth;roboMenu.classList.add('tocando-menu');falarMenu(falaMenuAleatoria('toque'))};roboMenu.addEventListener('click',reagir);roboMenu.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();reagir()}})}
const criarDecoracoesMenuAnterior=criarDecoracoesMenu;
criarDecoracoesMenu=function(){criarDecoracoesMenuAnterior();prepararBinoMenu()};
const mostrarMenuAnterior=mostrarMenu;
mostrarMenu=function(){clearTimeout(temporizadorCodigo);clearTimeout(temporizadorFalaMenu);mostrarMenuAnterior();prepararBinoMenu();saudarMenu()};
const mostrarCarregamentoAnterior=mostrarCarregamento;
mostrarCarregamento=function(){clearTimeout(temporizadorCodigo);if(e.codigo)e.codigo.textContent='';mostrarCarregamentoAnterior()};
const finalizarPartidaAnterior=finalizarPartida;
finalizarPartida=function(){clearTimeout(temporizadorCodigo);finalizarPartidaAnterior()};
function liberarMusicaJogo(){if(!ligada)return;e.audioJogo.pause();e.audioJogo.currentTime=0;e.audioJogo.volume=0;const tentativa=e.audioJogo.play();if(tentativa&&tentativa.catch)tentativa.catch(()=>{})}
const mostrarJogoAnterior=mostrarJogo;
mostrarJogo=function(){if(!e.audioJogo.paused)e.audioJogo.currentTime=0;mostrarJogoAnterior()};
function iniciarJogo(){jogador=limpar(e.nome.value)||jogador;if(!jogador){e.nome.focus();return}clearTimeout(temporizadorCodigo);clearTimeout(temporizadorFalaMenu);clique();liberarMusicaJogo();localStorage.setItem('binoJogador',jogador);e.topo.textContent=jogador;pontos=0;vidas=3;sequencia=0;melhorSequencia=0;missao=null;perguntasDaPartida=0;niveisRecentes=[];partidaEncerrada=false;e.lista.innerHTML='<p class="vazio">Suas descobertas aparecerao aqui.</p>';e.codSinal.textContent='Avance cinco acertos para detectar um sinal.';e.estado.textContent='BONUS';e.codigo.textContent='';e.resp.value='';atualizar();pausarFaixa(e.audioMenu);mostrarCarregamento();const mensagens=['PREPARANDO TRANSMISSAO...','CONECTANDO AO SISTEMA BINARIO...','B.I.N.O. ESTA CALIBRANDO OS SENSORES...'];let indice=0;clearInterval(window.cicloCarregamentoBino);window.cicloCarregamentoBino=setInterval(()=>{e.textoCarregamento.textContent=mensagens[++indice%mensagens.length]},650);clearTimeout(window.tempoCarregamentoBino);window.tempoCarregamentoBino=setTimeout(()=>{clearInterval(window.cicloCarregamentoBino);mostrarJogo();gerarPuzzleAleatorio();expressaoBino('surpreso');falar(falaAleatoria('inicio'))},2300)}
function contas(){return JSON.parse(localStorage.getItem('binoContas')||'{}')}
const falasInteracaoPartida=['Ei! Estou analisando cada bit com voce.','Meus sensores estao atentos!','Nao deixe essa sequencia te confundir.','Voce consegue decifrar isso!','Zeros e uns formam grandes descobertas.','Estou aqui para ajudar, decodificador.','Essa transmissao parece interessante.','B.I.N.O. continua online!','Toque gentilmente nos meus circuitos!','Yowch! Meus sensores fizeram cosquinha!','Owch! Mas eu ainda estou funcionando.','Hehe! Isso foi inesperado.'];
let ultimaInteracaoPartida='',ultimoToqueBinoPartida=0;
function falaInteracaoPartida(){const opcoes=falasInteracaoPartida.filter(f=>f!==ultimaInteracaoPartida);const fala=opcoes[Math.floor(Math.random()*opcoes.length)];ultimaInteracaoPartida=fala;return fala}
function somToqueBinoPartida(){if(!efeitos)return;audio();tom(470,.055,'sine',.035);tom(660,.07,'triangle',.027,.045)}
function prepararBinoPartida(){if(!e.robo||e.robo.dataset.interativo)return;e.robo.dataset.interativo='true';e.robo.setAttribute('role','button');e.robo.setAttribute('tabindex','0');e.robo.setAttribute('aria-label','Conversar com B.I.N.O.');const reagir=()=>{if(Date.now()-ultimoToqueBinoPartida<450)return;ultimoToqueBinoPartida=Date.now();somToqueBinoPartida();e.robo.classList.remove('toque-partida');void e.robo.offsetWidth;e.robo.classList.add('toque-partida');setTimeout(()=>e.robo.classList.remove('toque-partida'),650);expressaoBino('surpreso',650);falar(falaInteracaoPartida())};e.robo.addEventListener('click',reagir);e.robo.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();reagir()}})}
prepararBinoPartida();
function prepararBinoMenu(){const roboMenu=document.querySelector('.bino-menu-grande'),balao=document.getElementById('falaMenuBino');if(!roboMenu)return;if(!roboMenu.dataset.modeloBino){roboMenu.dataset.modeloBino='true';roboMenu.innerHTML='<span class="bino-antena"><i></i></span><span class="bino-cabeca"><i class="bino-olho"></i><i class="bino-olho"></i><i class="bino-boca"></i></span><strong class="bino-corpo">BINO</strong><i class="bino-anel"></i>'}if(roboMenu.dataset.pronto)return;roboMenu.dataset.pronto='true';roboMenu.setAttribute('role','button');roboMenu.setAttribute('tabindex','0');roboMenu.setAttribute('aria-label','Conversar com B.I.N.O.');if(balao){balao.setAttribute('role','button');balao.setAttribute('tabindex','0');balao.setAttribute('aria-label','Mostrar a fala completa do B.I.N.O.');balao.addEventListener('click',concluirFalaMenu);balao.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();concluirFalaMenu()}})}const reagir=()=>{if(Date.now()-ultimoToqueMenu<450)return;ultimoToqueMenu=Date.now();somToqueBinoMenu();roboMenu.classList.remove('tocando-menu');void roboMenu.offsetWidth;roboMenu.classList.add('tocando-menu');falarMenu(falaMenuAleatoria('toque'))};roboMenu.addEventListener('click',reagir);roboMenu.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();reagir()}})}
prepararBinoMenu();saudarMenu();
const mensagemContaAnterior=mensagemConta;
mensagemConta=function(texto,sucesso=false){mensagemContaAnterior(texto,sucesso);if(!sucesso)falarMenu(falaMenuAleatoria('erro'))};
e.criar.addEventListener('focus',()=>falarMenu(falaMenuAleatoria('criar')));
e.criar.addEventListener('click',()=>falarMenu(falaMenuAleatoria('criar')));
e.mostrarEntrar.addEventListener('click',()=>falarMenu(falaMenuAleatoria('entrar')));
e.mostrarCriar.addEventListener('click',()=>falarMenu(falaMenuAleatoria('criar')));
e.placar.addEventListener('click',()=>falarMenu(falaMenuAleatoria('placar')));
e.como.addEventListener('click',()=>falarMenu(falaMenuAleatoria('como')));
function mensagemConta(t,sucesso=false){const alvo=e.criarArea.hidden?e.senhaEntrar:e.confirmar;e.mensagem.remove();alvo.insertAdjacentElement('afterend',e.mensagem);e.mensagem.textContent=t;e.mensagem.className=sucesso?'mensagem-conta sucesso':'mensagem-conta'}
function criarConta(){const nome=limpar(e.nome.value),senha=e.senha.value,c=contas();if(!nome||senha.length<4||senha!==e.confirmar.value){mensagemConta('Preencha os dados. A senha deve ter ao menos 4 caracteres e coincidir.');return}if(c[nome]){mensagemConta('Este nome de usuário já foi usado neste navegador. Escolha outro nome.');return}c[nome]={senha};localStorage.setItem('binoContas',JSON.stringify(c));mensagemConta('Conta criada! Agora entre com seus dados.',true);e.nomeEntrar.value=nome;e.criarArea.hidden=true;e.entrarArea.hidden=false}
function entrarConta(){const nome=limpar(e.nomeEntrar.value),c=contas();if(!c[nome]||c[nome].senha!==e.senhaEntrar.value){mensagemConta('Nome de usuário ou senha incorretos.');return}jogador=nome;e.nome.value=nome;partidaEncerrada=false;iniciarJogo()}
e.criar.onclick=criarConta;e.entrar.onclick=entrarConta;e.mostrarEntrar.onclick=()=>{e.criarArea.hidden=true;e.entrarArea.hidden=false;e.mensagem.textContent=''};e.mostrarCriar.onclick=()=>{e.entrarArea.hidden=true;e.criarArea.hidden=false;e.mensagem.textContent=''};e.novo.onclick=()=>{partidaEncerrada=false;iniciarJogo()};e.menuDerrota.onclick=()=>{partidaEncerrada=false;mostrarMenu()};e.placarDerrota.onclick=mostrarPlacar;e.audioJogo.addEventListener('play',atualizarEstadoMusica);e.audioJogo.addEventListener('pause',atualizarEstadoMusica);e.como.onclick=()=>{e.modalC.innerHTML='<h2 id="tituloModal">COMO JOGAR</h2><p>Transforme bits em palavras e mantenha a transmissao ativa.</p><div class="passos-como"><div><b>1.</b> Consulte o Alfabeto Binario.</div><div><b>2.</b> Leia grupos de 8 bits.</div><div><b>3.</b> Digite a palavra ou frase.</div><div><b>4.</b> Acerte para ganhar pontos.</div><div><b>5.</b> Proteja seus 3 coracoes.</div><div><b>6.</b> Use dica ou pular com estrategia.</div><div><b>7.</b> Resolva Transmissoes Ocultas para bonus.</div></div>';abrirModal()};document.querySelectorAll('button').forEach(b=>{let ultimo=0;b.addEventListener('pointerenter',()=>{if(Date.now()-ultimo<130)return;ultimo=Date.now();audio();tom(760,.025,'sine',.018)});b.addEventListener('click',()=>{audio();tom(540,.05,'square',.04)})});document.addEventListener('pointerdown',()=>{if(estadoTela==='menu'&&!ligada){ligada=true;tocarFaixa(e.audioMenu)}},{once:true});
const botaoPular=document.createElement('button');botaoPular.id='botaoPular';botaoPular.className='botao-secundario';botaoPular.type='button';botaoPular.textContent='↷ PULAR (-125)';e.dica.insertAdjacentElement('afterend',botaoPular);botaoPular.addEventListener('click',pularSequencia);

/* Controle confiavel das duas faixas: o botao nao depende de uma musica pausada em outra tela. */
function atualizarEstadoMusica(){const texto=`MÚSICA: ${ligada?'LIGADA':'DESLIGADA'}`;e.musica.textContent=texto;e.musicaMenu.textContent=texto}
function fadeAudio(faixa,alvo,ms=500,finalizar){clearInterval(faixa._fadeBino);const inicio=Number(faixa.volume)||0,passos=16,delta=(alvo-inicio)/passos;let passo=0;faixa._fadeBino=setInterval(()=>{faixa.volume=Math.max(0,Math.min(1,faixa.volume+delta));if(++passo>=passos){clearInterval(faixa._fadeBino);faixa.volume=alvo;if(finalizar)finalizar()}},ms/passos)}
function pausarFaixa(faixa){clearInterval(faixa._fadeBino);if(faixa.paused){faixa.volume=0;return}fadeAudio(faixa,0,350,()=>{faixa.pause();faixa.currentTime=0})}
function tocarFaixa(faixa){const outra=faixa===e.audioMenu?e.audioJogo:e.audioMenu;pausarFaixa(outra);clearInterval(faixa._fadeBino);faixa.volume=0;const inicio=faixa.play();if(inicio&&inicio.then)inicio.then(()=>{if(ligada)fadeAudio(faixa,.18,700)}).catch(()=>{if(e.feedback)e.feedback.textContent='Não foi possível iniciar esta música. Verifique o arquivo de áudio.'})}
function alternarMusica(){ligada=!ligada;atualizarEstadoMusica();if(ligada){tocarFaixa(estadoTela==='menu'?e.audioMenu:e.audioJogo)}else{pausarFaixa(e.audioMenu);pausarFaixa(e.audioJogo)}}
function mostrarJogo(){estadoTela='jogo';ocultarTodasAsTelas();e.jogo.hidden=false;ajustarRolagem();if(ligada)tocarFaixa(e.audioJogo);atualizarEstadoMusica()}
e.musica.onclick=alternarMusica;e.musicaMenu.onclick=alternarMusica;
e.audioJogo.addEventListener('error',()=>{if(e.feedback)e.feedback.textContent='A música da partida não foi encontrada.'});

/* A faixa e autorizada no clique e revelada apenas quando o carregamento termina. */
let musicaPartidaPreparada=false;
function liberarMusicaJogo(){musicaPartidaPreparada=false;if(!ligada)return;e.audioJogo.pause();e.audioJogo.currentTime=0;e.audioJogo.muted=true;e.audioJogo.volume=0;const inicio=e.audioJogo.play();if(inicio&&inicio.then)inicio.then(()=>{musicaPartidaPreparada=true}).catch(()=>{musicaPartidaPreparada=false;if(e.feedback)e.feedback.textContent='Clique em MÚSICA para permitir a trilha da partida.'})}
function mostrarJogo(){estadoTela='jogo';ocultarTodasAsTelas();e.jogo.hidden=false;ajustarRolagem();if(!ligada){atualizarEstadoMusica();return}pausarFaixa(e.audioMenu);const revelar=()=>{e.audioJogo.muted=false;fadeAudio(e.audioJogo,.18,700)};if(musicaPartidaPreparada&&!e.audioJogo.paused){revelar()}else{e.audioJogo.volume=0;e.audioJogo.muted=false;const inicio=e.audioJogo.play();if(inicio&&inicio.then)inicio.then(revelar).catch(()=>{if(e.feedback)e.feedback.textContent='Não foi possível iniciar a música da partida.'})}atualizarEstadoMusica()}

/* Placar global opcional: preencha somente URL e chave publica anon no objeto abaixo. */
const configuracaoSupabase={url:'',chaveAnonima:''};
let bancoGlobal=null,canalPresenca=null,placarGlobalAtivo=false;
const idPresenca=localStorage.getItem('binoIdPresenca')||crypto.randomUUID();
localStorage.setItem('binoIdPresenca',idPresenca);
const indicadorOnline=document.getElementById('jogadoresOnline');
const termosBloqueados=['sexo','sexual','nude','nudes','nudez','porno','pornografia','putaria','drogas','droga','maconha','cocaina','violencia','matar','assassino','ameaca','ofensa','xingamento','palavrao','idiota','imbecil','otario','bosta','merda','porra','caralho','puta'];
function normalizarNomeParaFiltro(nome){return String(nome||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[0@]/g,'o').replace(/[1!|]/g,'i').replace(/[3]/g,'e').replace(/[4]/g,'a').replace(/[5$]/g,'s').replace(/[^a-z]/g,'').replace(/(.)\1{2,}/g,'$1$1')}
function nomePermitido(nome){const normalizado=normalizarNomeParaFiltro(nome);return normalizado.length>=3&&normalizado.length<=16&&!termosBloqueados.some(termo=>normalizado===termo||normalizado.startsWith(termo)||normalizado.endsWith(termo))}
function mostrarOnline(texto){if(indicadorOnline)indicadorOnline.textContent=texto}
function configurarBancoGlobal(){if(!configuracaoSupabase.url||!configuracaoSupabase.chaveAnonima||!window.supabase){mostrarOnline('● PLACAR LOCAL ATIVO');return false}try{bancoGlobal=window.supabase.createClient(configuracaoSupabase.url,configuracaoSupabase.chaveAnonima);placarGlobalAtivo=true;iniciarPresencaGlobal();return true}catch{mostrarOnline('● PLACAR GLOBAL INDISPONIVEL');return false}}
function atualizarPresenca(){if(!canalPresenca)return;const estado=canalPresenca.presenceState();const quantidade=Object.keys(estado).length;mostrarOnline(quantidade?`● ${quantidade} ${quantidade===1?'DECODIFICADOR ONLINE':'DECODIFICADORES ONLINE'}`:'● NENHUM DECODIFICADOR ONLINE NO MOMENTO')}
function iniciarPresencaGlobal(){if(!bancoGlobal||canalPresenca)return;canalPresenca=bancoGlobal.channel('presenca-decodificador',{config:{presence:{key:idPresenca}}});canalPresenca.on('presence',{event:'sync'},atualizarPresenca).subscribe(status=>{if(status==='SUBSCRIBED'){canalPresenca.track({ativo:true})}});document.addEventListener('visibilitychange',()=>{if(!canalPresenca)return;document.hidden?canalPresenca.untrack():canalPresenca.track({ativo:true})});window.addEventListener('beforeunload',()=>canalPresenca?.untrack())}
function dadosLocaisPlacar(){return JSON.parse(localStorage.getItem('binoPlacar')||'[]').map(x=>({nome:x.nome,melhor_pontuacao:x.pontos||0,melhor_sequencia:x.sequencia||0,partidas:x.partidas||1,ultima_partida:x.ultimaPartida||''}))}
function ordenarPlacar(lista){return [...lista].sort((a,b)=>(b.melhor_pontuacao||b.pontos||0)-(a.melhor_pontuacao||a.pontos||0)||(b.melhor_sequencia||b.sequencia||0)-(a.melhor_sequencia||a.sequencia||0)||String(b.atualizado_em||'').localeCompare(String(a.atualizado_em||'')))}
function tempoPlacar(item){return item.maior_tempo||'--:--'}
function renderPlacar(lista,global=false){const ordenado=ordenarPlacar(lista);e.modalC.innerHTML=`<h2 id="tituloModal">${global?'PLACAR GLOBAL':'PLACAR LOCAL'}</h2><p>${global?'Resultados compartilhados entre dispositivos.':'Placar global indisponível no momento. Seus dados locais continuam salvos.'}</p>${ordenado.length?`<ol class="ranking">${ordenado.map(x=>`<li>${roboMini()} <button class="nome-ranking" type="button" data-jogador="${x.nome}">${x.nome}</button><span>${x.melhor_pontuacao??x.pontos??0} pontos · sequência ${x.melhor_sequencia??x.sequencia??0} · ${tempoPlacar(x)}</span></li>`).join('')}</ol>`:'<p>Nenhuma partida registrada ainda.</p>'}`;abrirModal();e.modalC.querySelectorAll('.nome-ranking').forEach(botao=>botao.onclick=()=>mostrarPerfilGlobal(botao.dataset.jogador,ordenado))}
function mostrarPerfilGlobal(nome,lista){const item=lista.find(x=>x.nome===nome);if(!item)return;e.modalC.innerHTML=`<h2 id="tituloModal">PERFIL DO DECODIFICADOR</h2><p class="perfil-nome">${roboMini()} ${item.nome}</p><p>Maior pontuação: <strong>${item.melhor_pontuacao??item.pontos??0}</strong></p><p>Melhor sequência: <strong>${item.melhor_sequencia??item.sequencia??0}</strong></p><p>Maior tempo: <strong>${tempoPlacar(item)}</strong></p><p>Partidas realizadas: <strong>${item.partidas||1}</strong></p><p>Última partida: <strong>${item.ultima_partida||item.atualizado_em||'Não disponível'}</strong></p>`;abrirModal()}
async function mostrarPlacar(){renderPlacar(dadosLocaisPlacar(),false);if(!placarGlobalAtivo)return;try{const {data,error}=await bancoGlobal.from('jogadores').select('nome,melhor_pontuacao,melhor_sequencia,maior_tempo,partidas,ultima_partida,atualizado_em').order('melhor_pontuacao',{ascending:false}).order('melhor_sequencia',{ascending:false}).limit(100);if(error)throw error;renderPlacar(data||[],true)}catch{renderPlacar(dadosLocaisPlacar(),false)}}
async function salvarPlacar(){let lista=JSON.parse(localStorage.getItem('binoPlacar')||'[]'),indice=lista.findIndex(x=>x.nome===jogador),anterior=lista[indice]||{},registro={nome:jogador,pontos:Math.max(pontos,anterior.pontos||0),sequencia:Math.max(melhorSequencia,anterior.sequencia||0),partidas:(anterior.partidas||0)+1,ultimaPartida:new Date().toLocaleDateString('pt-BR')};if(indice>=0)lista[indice]=registro;else lista.push(registro);localStorage.setItem('binoPlacar',JSON.stringify(lista));if(!placarGlobalAtivo||!nomePermitido(jogador))return;const global={nome:jogador,melhor_pontuacao:Math.min(999999,registro.pontos),melhor_sequencia:Math.min(9999,registro.sequencia),maior_tempo:'--:--',partidas:registro.partidas,ultima_partida:registro.ultimaPartida,atualizado_em:new Date().toISOString()};try{await bancoGlobal.from('jogadores').upsert(global,{onConflict:'nome'})}catch{}}
async function criarConta(){const nome=limpar(e.nome.value),senha=e.senha.value,c=contas();if(!nomePermitido(nome)){mensagemConta('Escolha um nome de usuário apropriado para o jogo.');falarMenu('Vamos escolher um nome amigável para nossa missão.');return}if(!nome||senha.length<4||senha!==e.confirmar.value){mensagemConta('Preencha os dados. A senha deve ter ao menos 4 caracteres e coincidir.');return}if(c[nome]){mensagemConta('Este nome de usuário já foi usado neste navegador. Escolha outro nome.');return}if(placarGlobalAtivo){try{const {data}=await bancoGlobal.from('jogadores').select('nome').eq('nome',nome).maybeSingle();if(data){mensagemConta('Este nome de usuário já está em uso. Escolha outro nome.');return}}catch{}}c[nome]={senha};localStorage.setItem('binoContas',JSON.stringify(c));mensagemConta('Conta criada! Agora entre com seus dados.',true);e.nomeEntrar.value=nome;e.criarArea.hidden=true;e.entrarArea.hidden=false}
function entrarConta(){const nome=limpar(e.nomeEntrar.value),c=contas();if(!nomePermitido(nome)){mensagemConta('Escolha um nome de usuário apropriado para o jogo.');falarMenu('Vamos escolher um nome amigável para nossa missão.');return}if(!c[nome]||c[nome].senha!==e.senhaEntrar.value){mensagemConta('Nome de usuário ou senha incorretos.');return}jogador=nome;e.nome.value=nome;partidaEncerrada=false;iniciarJogo()}
e.criar.onclick=criarConta;e.entrar.onclick=entrarConta;e.placar.onclick=mostrarPlacar;e.placarDerrota.onclick=mostrarPlacar;
configurarBancoGlobal();

/* Menu simplificado: nome temporario, sem conta nem placar. */
delete falasMenu.criar;delete falasMenu.entrar;delete falasMenu.placar;delete falasMenu.erro;
function salvarPlacar(){}
function mostrarPlacar(){}
function entrarDireto(){const nome=limpar(e.nome.value);if(!nome){e.mensagem.textContent='Digite um nome de usuário para entrar no jogo.';e.mensagem.className='mensagem-conta';e.nome.focus();return}jogador=nome;e.mensagem.textContent='';e.topo.textContent=jogador;partidaEncerrada=false;iniciarJogo()}
e.entrar.onclick=entrarDireto;
e.nome.addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();entrarDireto()}});

/* Revelar letra: ajuda visual paga, sem alterar o campo de resposta. */
const botaoRevelar=document.createElement('button');
botaoRevelar.id='botaoRevelarLetra';botaoRevelar.className='botao-secundario';botaoRevelar.type='button';botaoRevelar.textContent='◇ REVELAR LETRA (-200)';
document.getElementById('botaoPular')?.insertAdjacentElement('afterend',botaoRevelar);
const painelReveladas=document.createElement('div');painelReveladas.id='letrasReveladas';painelReveladas.setAttribute('aria-live','polite');
e.codigo.parentElement.insertAdjacentElement('afterend',painelReveladas);
let posicoesReveladas=new Set(),ultimaFalaRevelar='',temporizadorLetrasReveladas=0;
const falasRevelar=['Uma letra foi decifrada pelos meus sensores!','Pequena pista liberada. Use com sabedoria!','Agora a transmissao esta um pouco mais clara.','Bits analisados! Uma letra apareceu.','Essa descoberta pode mudar tudo!','Sinal parcial traduzido com sucesso.','Uma pista digital para voce, decodificador.','Vamos usar essa letra para montar a resposta!','Meus sensores encontraram uma letra escondida!','A sequencia esta comecando a fazer sentido.'];
const falasSemPontosRevelar=['Precisamos de mais energia digital para revelar uma letra.','Duzentos pontos sao necessarios para essa analise.','Continue acertando e logo poderemos liberar uma letra.','Ainda nao temos pontos suficientes, mas voce consegue!','Vamos decifrar mais algumas sequencias primeiro.'];
const falasTudoRevelado=['Todos os sinais de letra desta transmissao ja foram encontrados!','Agora a resposta esta quase completa!','Nao restam letras escondidas para analisar nesta sequencia.'];
function falaRevelarAleatoria(lista){const opcoes=lista.filter(f=>f!==ultimaFalaRevelar);const fala=opcoes[Math.floor(Math.random()*opcoes.length)];ultimaFalaRevelar=fala;return fala}
function letraAleatoriaNaoRevelada(){const letrasMostradas=new Set([...posicoesReveladas].map(indice=>atual[indice]));const opcoes=[...atual].map((letra,indice)=>letra!==' '&&!posicoesReveladas.has(indice)&&!letrasMostradas.has(letra)?indice:null).filter(indice=>indice!==null);return opcoes.length?opcoes[Math.floor(Math.random()*opcoes.length)]:null}
function desenharLetrasReveladas(quantidade=Infinity){if(!atual){painelReveladas.textContent='';return}let exibidas=0;const visual=[...atual].map((letra,indice)=>{if(letra===' ')return '<i aria-hidden="true"></i>';exibidas++;if(exibidas>quantidade)return '';return posicoesReveladas.has(indice)?`<b>${letra.toUpperCase()}</b>`:'_' }).join(' ');painelReveladas.innerHTML=`<span>LETRAS REVELADAS</span><strong>${visual}</strong>`;const acabou=letraAleatoriaNaoRevelada()===null;botaoRevelar.disabled=acabou;botaoRevelar.textContent=acabou?'LETRAS REVELADAS':'◇ REVELAR LETRA (-200)'}
function somTracoRevelado(indice){if(!efeitos)return;audio();tom(390+(indice%4)*55,.028,'square',.018)}
function atualizarLetrasReveladas(){clearTimeout(temporizadorLetrasReveladas);desenharLetrasReveladas()}
function animarLetrasReveladas(){clearTimeout(temporizadorLetrasReveladas);if(!atual){painelReveladas.textContent='';return}const total=[...atual].filter(letra=>letra!==' ').length;let quantidade=0;const mostrar=()=>{quantidade++;desenharLetrasReveladas(quantidade);somTracoRevelado(quantidade);if(quantidade<total)temporizadorLetrasReveladas=setTimeout(mostrar,55)};desenharLetrasReveladas(0);temporizadorLetrasReveladas=setTimeout(mostrar,90)}
function revelarLetra(){if(partidaEncerrada)return;const indice=letraAleatoriaNaoRevelada();if(indice===null){e.feedback.className='erro';e.feedback.textContent='Todas as letras desta transmissão já foram reveladas.';falar(falaRevelarAleatoria(falasTudoRevelado));atualizarLetrasReveladas();return}if(pontos<200){e.feedback.className='erro';e.feedback.textContent='Pontos insuficientes para revelar uma letra.';expressaoBino('preocupado');falar(falaRevelarAleatoria(falasSemPontosRevelar));return}pontos-=200;[...atual].forEach((letra,posicao)=>{if(letra===atual[indice])posicoesReveladas.add(posicao)});audio();[520,760,980].forEach((nota,ordem)=>tom(nota,.1,'sine',.055,ordem*.07));e.feedback.className='acerto';e.feedback.textContent=`-200 pontos · Letra ${atual[indice].toUpperCase()} revelada.`;e.codigo.parentElement.classList.remove('revelacao-letra');void e.codigo.parentElement.offsetWidth;e.codigo.parentElement.classList.add('revelacao-letra');expressaoBino('orgulhoso');atualizar();atualizarLetrasReveladas();falar(falaRevelarAleatoria(falasRevelar))}
botaoRevelar.addEventListener('click',revelarLetra);
const gerarPuzzleAntesDeRevelar=gerarPuzzleAleatorio;
gerarPuzzleAleatorio=function(){clearTimeout(temporizadorLetrasReveladas);posicoesReveladas=new Set();gerarPuzzleAntesDeRevelar();animarLetrasReveladas()};

/* Transmissao Oculta: terminal de analise e recompensa afetada pelo multiplicador. */
const painelSinalParcial=document.createElement('div');
painelSinalParcial.id='sinalParcial';painelSinalParcial.setAttribute('aria-live','polite');
e.codSinal.insertAdjacentElement('afterend',painelSinalParcial);
let temporizadorSinalParcial=0;
function multiplicadorAtual(){return sequencia>=4?3:sequencia>=2?2:1}
function desenharSinalParcial(quantidade=Infinity,concluido=false){if(!missao){painelSinalParcial.innerHTML='';return}let exibidas=0;const visual=[...missao].map(letra=>{if(letra===' ')return '<i aria-hidden="true"></i>';exibidas++;if(concluido)return `<b>${letra.toUpperCase()}</b>`;return exibidas<=quantidade?'_':''}).join(' ');painelSinalParcial.innerHTML=`<span>${concluido?'TRANSMISSAO DECIFRADA':'ANALISANDO SINAL RARO...'}</span><small>${concluido?'DADOS COMPLETOS RECEBIDOS':'DADOS PARCIAIS RECEBIDOS  ▮▮▯'}</small><strong>${visual}</strong>`}
function somTracoSinal(indice){if(!efeitos)return;audio();tom(285+(indice%5)*42,.03,'square',.016)}
function animarSinalParcial(){clearTimeout(temporizadorSinalParcial);if(!missao){painelSinalParcial.innerHTML='';return}const total=[...missao].filter(letra=>letra!==' ').length;let quantidade=0;desenharSinalParcial(0);const mostrar=()=>{quantidade++;desenharSinalParcial(quantidade);somTracoSinal(quantidade);if(quantidade<total)temporizadorSinalParcial=setTimeout(mostrar,58)};temporizadorSinalParcial=setTimeout(mostrar,100)}
const liberarTransmissaoOcultaAnterior=liberarTransmissaoOculta;
liberarTransmissaoOculta=function(){clearTimeout(temporizadorSinalParcial);liberarTransmissaoOcultaAnterior();animarSinalParcial()};
let temporizadorCodigoSinal=0;
function mostrarCodigoSinalGradual(codigo){clearTimeout(temporizadorCodigoSinal);e.codSinal.textContent='';e.codSinal.classList.add('codigo-sinal-digitando');let indice=0;const escrever=()=>{if(indice>=codigo.length){e.codSinal.classList.remove('codigo-sinal-digitando');return}const bit=codigo[indice++];e.codSinal.textContent+=bit;if(bit==='0'||bit==='1'){audio();tom(360+(indice%6)*32,.018,'square',.011)}temporizadorCodigoSinal=setTimeout(escrever,bit===' '?42:24)};escrever()}
const liberarTransmissaoComCodigo=liberarTransmissaoOculta;
liberarTransmissaoOculta=function(){liberarTransmissaoComCodigo();if(missao)mostrarCodigoSinalGradual(binario(missao))};
const verificarSinalAntesDoCodigo=verificarSinal;
verificarSinal=function(){clearTimeout(temporizadorCodigoSinal);verificarSinalAntesDoCodigo()};
verificarSinal=function(){if(limpar(e.respSinal.value)!==missao){e.resSinal.textContent='Ainda nao foi decifrado. Voce pode tentar novamente sem perder vidas.';return}clearTimeout(temporizadorSinalParcial);const multiplicador=multiplicadorAtual(),recompensa=150*multiplicador,ganhouVida=vidas<3;pontos+=recompensa;if(ganhouVida)vidas++;registrar(`transmissao oculta: ${missao}`);desenharSinalParcial(Infinity,true);painelSinalParcial.classList.remove('sinal-desbloqueado');void painelSinalParcial.offsetWidth;painelSinalParcial.classList.add('sinal-desbloqueado');e.resSinal.textContent=`TRANSMISSAO DECIFRADA! +${recompensa} PONTOS (150 x${multiplicador})${ganhouVida?' · +1 CORACAO':''}`;e.formSinal.hidden=true;e.estado.textContent='DECIFRADA';audio();[440,660,880,1040].forEach((n,i)=>tom(n,.12,'sine',.08,i*.09));missao=null;atualizar();expressaoBino('orgulhoso');falar('Transmissao oculta decifrada. Meus sensores estao comemorando!')};

/* Evento secreto: muitos toques rapidos sobre o B.I.N.O. causam uma sobrecarga reversivel ao recarregar. */
let toquesBinoRapidos=[],sobrecargaBino=false;
const telaSobrecarga=document.createElement('section');
telaSobrecarga.id='telaSobrecarga';telaSobrecarga.hidden=true;telaSobrecarga.setAttribute('aria-live','assertive');
telaSobrecarga.innerHTML='<div class="sobrecarga-caixa"><span>ERRO CRITICO: B.I.N.O. SOBRECARREGADO</span><h2>Por que voce fez isso com os meus circuitos?</h2><div class="tumulo-bino"><b>R.I.P.</b><strong>B.I.N.O.</strong></div><p>RECARREGUE A PAGINA PARA REINICIAR OS SISTEMAS DO B.I.N.O.</p></div>';
document.body.append(telaSobrecarga);
function dispararSobrecargaBino(){if(sobrecargaBino)return;sobrecargaBino=true;clearTimeout(temporizadorFala);clearTimeout(temporizadorFalaMenu);clearTimeout(temporizadorCodigo);clearTimeout(temporizadorLetrasReveladas);clearTimeout(temporizadorSinalParcial);audio();[180,230,300,390,530,720].forEach((nota,indice)=>tom(nota,.07,'sawtooth',.055,indice*.07));e.robo?.classList.add('bino-sobrecarregado');document.querySelector('.bino-menu-grande')?.classList.add('bino-sobrecarregado');setTimeout(()=>{telaSobrecarga.hidden=false;document.body.classList.add('sobrecarga-ativa');document.activeElement?.blur()},620)}
const dispararSobrecargaBinoBase=dispararSobrecargaBino;
function somExplosaoBino8Bit(){if(!efeitos)return;audio();[840,670,510,380,270,190,130].forEach((nota,indice)=>tom(nota,.075,'square',.06,indice*.035));[120,94,74].forEach((nota,indice)=>tom(nota,.12,'sawtooth',.045,.12+indice*.07))}
function somTristeBino(){if(!efeitos)return;audio();[392,330,262,196].forEach((nota,indice)=>tom(nota,.24,'triangle',.055,indice*.19))}
dispararSobrecargaBino=function(){if(sobrecargaBino)return;somExplosaoBino8Bit();setTimeout(()=>{pausarFaixa(e.audioJogo);pausarFaixa(e.audioMenu)},230);setTimeout(somTristeBino,670);dispararSobrecargaBinoBase()}
const videoExplosaoBino=document.createElement('video'),telaExplosaoBino=document.createElement('canvas'),desenhoExplosaoBino=telaExplosaoBino.getContext('2d',{willReadFrequently:true});
videoExplosaoBino.src='assets/explosao-bino.mp4';videoExplosaoBino.preload='auto';videoExplosaoBino.playsInline=true;videoExplosaoBino.setAttribute('aria-hidden','true');videoExplosaoBino.style.display='none';
telaExplosaoBino.id='explosaoBinoVideo';telaExplosaoBino.hidden=true;telaExplosaoBino.setAttribute('aria-hidden','true');document.body.append(videoExplosaoBino,telaExplosaoBino);
let quadroExplosaoBino=0,explosaoBinoVisivel=false;
function alvoDaExplosaoBino(){return estadoTela==='menu'?document.querySelector('.bino-menu-grande'):e.robo}
function posicionarExplosaoBino(alvo){const area=alvo.getBoundingClientRect(),tamanho=Math.max(area.width,area.height)*1.9;telaExplosaoBino.width=360;telaExplosaoBino.height=360;telaExplosaoBino.style.width=`${tamanho}px`;telaExplosaoBino.style.height=`${tamanho}px`;telaExplosaoBino.style.left=`${area.left+area.width/2-tamanho/2}px`;telaExplosaoBino.style.top=`${area.top+area.height/2-tamanho/2}px`}
function desenharExplosaoBino(){if(videoExplosaoBino.paused||videoExplosaoBino.ended)return;if(videoExplosaoBino.readyState<2){quadroExplosaoBino=requestAnimationFrame(desenharExplosaoBino);return}desenhoExplosaoBino.drawImage(videoExplosaoBino,0,0,telaExplosaoBino.width,telaExplosaoBino.height);const pixels=desenhoExplosaoBino.getImageData(0,0,telaExplosaoBino.width,telaExplosaoBino.height),dados=pixels.data;let pixelsVisiveis=0;for(let indice=0;indice<dados.length;indice+=4){const vermelho=dados[indice],verde=dados[indice+1],azul=dados[indice+2],fundoVerde=verde>vermelho*1.28&&verde>azul*1.2&&verde>82;if(fundoVerde)dados[indice+3]=0;else if(vermelho+verde+azul>105)pixelsVisiveis++}desenhoExplosaoBino.putImageData(pixels,0,0);if(!explosaoBinoVisivel&&pixelsVisiveis>160){explosaoBinoVisivel=true;telaExplosaoBino.hidden=false}quadroExplosaoBino=requestAnimationFrame(desenharExplosaoBino)}
function tocarVideoExplosaoBino(){const alvo=alvoDaExplosaoBino();if(!alvo)return;cancelAnimationFrame(quadroExplosaoBino);explosaoBinoVisivel=false;posicionarExplosaoBino(alvo);telaExplosaoBino.hidden=true;videoExplosaoBino.currentTime=0;const inicio=videoExplosaoBino.play();if(inicio&&inicio.catch)inicio.catch(()=>{telaExplosaoBino.hidden=true});alvo.style.visibility='hidden';requestAnimationFrame(desenharExplosaoBino)}
videoExplosaoBino.addEventListener('ended',()=>{cancelAnimationFrame(quadroExplosaoBino);telaExplosaoBino.hidden=true});videoExplosaoBino.addEventListener('error',()=>{telaExplosaoBino.hidden=true});
const dispararSobrecargaComSomEfeito=dispararSobrecargaBino;
dispararSobrecargaBino=function(){if(sobrecargaBino)return;tocarVideoExplosaoBino();dispararSobrecargaComSomEfeito()}
function registrarToqueRapidoBino(){if(sobrecargaBino)return;const agora=Date.now();toquesBinoRapidos=toquesBinoRapidos.filter(tempo=>agora-tempo<2000);toquesBinoRapidos.push(agora);if(toquesBinoRapidos.length>=9)dispararSobrecargaBino()}
document.addEventListener('click',evento=>{if(evento.target.closest('.bino-menu-grande,#robo'))registrarToqueRapidoBino()},true);
document.addEventListener('keydown',evento=>{if((evento.key==='Enter'||evento.key===' ')&&document.activeElement?.matches('.bino-menu-grande,#robo'))registrarToqueRapidoBino()},true);

/* Terminal de inicializacao: acompanha os mesmos 2,3 segundos da tela de carregamento. */
const historicoCarregamento=$('historicoCarregamento'),progressoCarregamento=$('progressoCarregamento'),bitsCarregamento=$('bitsCarregamento'),barraCarregamento=e.carregamento.querySelector('.barra-carregamento i');
let temporizadoresTerminal=[],temporizadorTextoCarregamento=0,versaoTerminal=0;
function limparTerminalCarregamento(){temporizadoresTerminal.forEach(clearTimeout);temporizadoresTerminal=[];clearTimeout(temporizadorTextoCarregamento);versaoTerminal++}
function bipeTerminal(nota=420){if(!efeitos)return;audio();tom(nota,.045,'square',.02)}
function escreverTerminal(texto,versao){clearTimeout(temporizadorTextoCarregamento);e.textoCarregamento.textContent='';let indice=0;const escrever=()=>{if(versao!==versaoTerminal||indice>=texto.length)return;const letra=texto[indice++];e.textoCarregamento.textContent+=letra;if(letra!==' '&&indice%4===0)bipeTerminal(360+(indice%5)*48);temporizadorTextoCarregamento=setTimeout(escrever,14)};escrever()}
function iniciarTerminalCarregamento(){limparTerminalCarregamento();const versao=versaoTerminal,mensagens=['PREPARANDO TRANSMISSAO...','CONECTANDO AO SISTEMA BINARIO...','B.I.N.O. ESTA CALIBRANDO OS SENSORES...','CARREGANDO BANCO DE CODIGOS...'],percentuais=[12,28,47,68,83,100];historicoCarregamento.textContent='';progressoCarregamento.textContent='0%';barraCarregamento.style.width='0%';bitsCarregamento.textContent='01000001 00110010 01101111';mensagens.forEach((mensagem,indice)=>{temporizadoresTerminal.push(setTimeout(()=>{if(versao!==versaoTerminal)return;historicoCarregamento.textContent=indice?mensagens[indice-1]:'AGUARDANDO SINAL...';escreverTerminal(mensagem,versao);bipeTerminal(440+indice*45);bitsCarregamento.textContent=['01000001 00110010 01101111','00110101 01000011 01101010','01110011 00100001 01010100','01000011 01001111 01000100'][indice]},indice*520))});percentuais.forEach((valor,indice)=>{temporizadoresTerminal.push(setTimeout(()=>{if(versao!==versaoTerminal)return;progressoCarregamento.textContent=`${valor}%`;barraCarregamento.style.width=`${valor}%`;if(indice===percentuais.length-1){historicoCarregamento.textContent='SISTEMA PRONTO. TRANSMISSAO ATIVA.';bipeTerminal(820)}else if(indice%2===0)bipeTerminal(300+indice*50)},160+indice*360))})}
const iniciarJogoComTerminal=iniciarJogo;
iniciarJogo=function(){iniciarJogoComTerminal();clearInterval(window.cicloCarregamentoBino);iniciarTerminalCarregamento()};
const mostrarJogoComTerminal=mostrarJogo;
mostrarJogo=function(){limparTerminalCarregamento();mostrarJogoComTerminal()};

/* Cena retro da sobrecarga: cada explosao recebe fragmentos diferentes do B.I.N.O. */
const pecasSobrecarga=[
 {tipo:'antena-caida',nome:'O.N.I.B',rotulo:'ANTENA CAIDA'},
 {tipo:'olho-ciano',nome:'B.O.N.I',rotulo:'OLHO ESQUERDO'},
 {tipo:'circuito-amarelo',nome:'N.I.B.O',rotulo:'CIRCUITO AUXILIAR'},
 {tipo:'engrenagem-laranja',nome:'H.E.R.O.N',rotulo:'MODULO DE SINAIS'},
 {tipo:'erro-vermelho',nome:'G.R.F.C',rotulo:'TELA DE ERRO'},
 {tipo:'mini-roxo',nome:'X.Y.N.N',rotulo:'ROBO AUXILIAR'},
 {tipo:'placa-teste',nome:'T.E.S.T',rotulo:'MEMORIA LOCAL'}
];
let ultimaCenaSobrecarga='';
function embaralharSobrecarga(lista){return [...lista].sort(()=>Math.random()-.5)}
function montarCenaSobrecarga(){let escolhas=[],assinatura='';for(let tentativas=0;tentativas<5;tentativas++){escolhas=embaralharSobrecarga(pecasSobrecarga).slice(0,3+Math.floor(Math.random()*3));assinatura=escolhas.map(item=>item.nome).sort().join('|');if(assinatura!==ultimaCenaSobrecarga)break}ultimaCenaSobrecarga=assinatura;const fragmentos=escolhas.map((item,indice)=>'<div class="fragmento-bino '+item.tipo+'" style="--x:'+(12+Math.random()*76)+'%;--y:'+(19+Math.random()*62)+'%;--atraso:'+(indice*.17)+'s"><i></i><b>'+item.nome+'</b></div>').join('');telaSobrecarga.innerHTML='<div class="chuva-bits" aria-hidden="true">01000001 00110010 01101111 · 0 1 0 1 · 00110101</div><div class="logs-sobrecarga" aria-hidden="true"><span>ERRO: SENSORES INDISPONIVEIS</span><span>SINAL DE B.I.N.O. PERDIDO</span><span>TENTANDO RECONECTAR...</span><span>FALHA NO NUCLEO DIGITAL</span></div><div class="fragmentos-sobrecarga" aria-hidden="true">'+fragmentos+'</div><div class="sobrecarga-caixa"><span>ERRO CRITICO: B.I.N.O. SOBRECARREGADO</span><div class="indicador-falha" aria-hidden="true">▮▯▯ ▮▯▯ ▮▯▯</div><h2>Por que voce fez isso com os meus circuitos?</h2><div class="tumulo-bino"><i class="antena-quebrada" aria-hidden="true"></i><b>R.I.P. :(</b><strong>B.I.N.O.</strong></div><p>RECARREGUE A PAGINA PARA REINICIAR OS SISTEMAS DO B.I.N.O.</p></div>'}
const dispararSobrecargaComCena=dispararSobrecargaBino;
dispararSobrecargaBino=function(){if(sobrecargaBino)return;montarCenaSobrecarga();dispararSobrecargaComCena()};
const montarCenaSobrecargaBase=montarCenaSobrecarga;
montarCenaSobrecarga=function(){montarCenaSobrecargaBase();const posicoes=embaralharSobrecarga([{x:12,y:20},{x:88,y:20},{x:10,y:74},{x:90,y:74},{x:6,y:48},{x:94,y:48}]);telaSobrecarga.querySelectorAll('.fragmento-bino').forEach((peca,indice)=>{const posicao=posicoes[indice];peca.style.setProperty('--x',posicao.x+'%');peca.style.setProperty('--y',posicao.y+'%')})};
let fonteEstaticaSobrecarga=null,ganhoEstaticaSobrecarga=null;
function iniciarEstaticaSobrecarga(){if(!efeitos||fonteEstaticaSobrecarga)return;audio();const duracao=Math.max(1,Math.floor(ctx.sampleRate*.75)),buffer=ctx.createBuffer(1,duracao,ctx.sampleRate),dados=buffer.getChannelData(0);for(let indice=0;indice<dados.length;indice++)dados[indice]=(Math.random()*2-1)*.52;fonteEstaticaSobrecarga=ctx.createBufferSource();ganhoEstaticaSobrecarga=ctx.createGain();const filtro=ctx.createBiquadFilter();filtro.type='bandpass';filtro.frequency.value=1600;filtro.Q.value=.7;ganhoEstaticaSobrecarga.gain.value=.014;fonteEstaticaSobrecarga.buffer=buffer;fonteEstaticaSobrecarga.loop=true;fonteEstaticaSobrecarga.connect(filtro).connect(ganhoEstaticaSobrecarga).connect(master);fonteEstaticaSobrecarga.start()}
function pararEstaticaSobrecarga(){if(!fonteEstaticaSobrecarga)return;fonteEstaticaSobrecarga.stop();fonteEstaticaSobrecarga=null;ganhoEstaticaSobrecarga=null}
const dispararSobrecargaComEstatica=dispararSobrecargaBino;
dispararSobrecargaBino=function(){if(sobrecargaBino)return;dispararSobrecargaComEstatica();setTimeout(iniciarEstaticaSobrecarga,650)};

/* Derrota normal: terminal retro, B.I.N.O. em recuperacao e mensagem motivadora. */
const fundoDerrotaRetro=document.createElement('div');
fundoDerrotaRetro.className='fundo-derrota-retro';fundoDerrotaRetro.setAttribute('aria-hidden','true');
fundoDerrotaRetro.innerHTML='<span class="bits-derrota">01000001 00110010 01101111 0 1 0 1</span><div class="logs-derrota"><i>SINAL INTERROMPIDO</i><i>VIDAS ESGOTADAS</i><i>TRANSMISSAO ENCERRADA</i><i>SALVANDO DADOS DA MISSAO...</i></div>';
e.derrota.prepend(fundoDerrotaRetro);
const statusBinoDerrota=document.createElement('small');
statusBinoDerrota.id='statusBinoDerrota';statusBinoDerrota.textContent='B.I.N.O. EM MODO DE RECUPERACAO';
e.derrota.querySelector('.triste-mini')?.insertAdjacentElement('afterend',statusBinoDerrota);
const falaDerrota=document.createElement('p');
falaDerrota.id='falaDerrota';falaDerrota.setAttribute('aria-live','polite');
e.resumoDerrota.insertAdjacentElement('afterend',falaDerrota);
const falasDerrota=['A transmissao caiu, mas voce foi muito bem!','Nao se preocupe. Cada tentativa deixa voce mais rapido.','Meus sensores viram muito esforco nessa missao.','As vidas acabaram, mas seu aprendizado continua.','Vamos analisar os bits novamente em outra partida?','Voce chegou longe. Eu acredito na proxima transmissao!','Nenhum decodificador acerta tudo de primeira.','O sinal foi perdido, mas podemos reconectar quando voce quiser.','Voce aprendeu mais um pouco sobre os segredos binarios.','Missao encerrada por enquanto. Estarei pronto para a proxima.'];
let ultimaFalaDerrota='',temporizadorFalaDerrota=0;
function falarDerrota(){clearTimeout(temporizadorFalaDerrota);const opcoes=falasDerrota.filter(fala=>fala!==ultimaFalaDerrota),texto=opcoes[Math.floor(Math.random()*opcoes.length)];ultimaFalaDerrota=texto;falaDerrota.textContent='';let indice=0;const escrever=()=>{if(indice>=texto.length)return;const letra=texto[indice++];falaDerrota.textContent+=letra;bipBino(letra);temporizadorFalaDerrota=setTimeout(escrever,letra===' '?40:/[.!?,:]/.test(letra)?68:27)};escrever()}
function somDerrotaRetro(){if(!efeitos)return;audio();[420,350,280,220].forEach((nota,indice)=>tom(nota,.15,'triangle',.055,indice*.12));setTimeout(()=>{if(efeitos){audio();tom(125,.18,'square',.035);tom(92,.22,'triangle',.025,.1)}},520)}
const finalizarPartidaRetro=finalizarPartida;
finalizarPartida=function(){finalizarPartidaRetro();if(!e.derrota.hidden){somDerrotaRetro();falarDerrota()}};
e.novo.addEventListener('click',()=>clearTimeout(temporizadorFalaDerrota));
e.menuDerrota.addEventListener('click',()=>clearTimeout(temporizadorFalaDerrota));

/* Audio da derrota normal: a musica para e o terminal fica em estatica baixa. */
let fonteEstaticaDerrota=null,ganhoEstaticaDerrota=null;
function iniciarEstaticaDerrota(){
  if(!efeitos||fonteEstaticaDerrota)return;
  audio();
  const duracao=Math.max(1,Math.floor(ctx.sampleRate*.8));
  const buffer=ctx.createBuffer(1,duracao,ctx.sampleRate);
  const dados=buffer.getChannelData(0);
  for(let indice=0;indice<dados.length;indice++)dados[indice]=(Math.random()*2-1)*.32;
  fonteEstaticaDerrota=ctx.createBufferSource();
  ganhoEstaticaDerrota=ctx.createGain();
  const filtro=ctx.createBiquadFilter();
  filtro.type='bandpass';filtro.frequency.value=1350;filtro.Q.value=.75;
  ganhoEstaticaDerrota.gain.value=.012;
  fonteEstaticaDerrota.buffer=buffer;fonteEstaticaDerrota.loop=true;
  fonteEstaticaDerrota.connect(filtro).connect(ganhoEstaticaDerrota).connect(master);
  fonteEstaticaDerrota.start();
}
function pararEstaticaDerrota(){
  if(!fonteEstaticaDerrota)return;
  try{fonteEstaticaDerrota.stop()}catch(erro){}
  fonteEstaticaDerrota=null;ganhoEstaticaDerrota=null;
}
const finalizarPartidaComSomNormal=finalizarPartida;
finalizarPartida=function(){
  pausarFaixa(e.audioJogo);
  finalizarPartidaComSomNormal();
  if(!e.derrota.hidden)setTimeout(iniciarEstaticaDerrota,620);
};
e.novo.addEventListener('click',pararEstaticaDerrota);
e.menuDerrota.addEventListener('click',pararEstaticaDerrota);
const alternarEfeitosComEstaticaDerrota=e.efeitos.onclick;
e.efeitos.onclick=()=>{
  alternarEfeitosComEstaticaDerrota();
  if(!efeitos)pararEstaticaDerrota();
  else if(!e.derrota.hidden)iniciarEstaticaDerrota();
};

/* Dados locais do jogador e terminal de estatisticas do menu. */
const botaoDados=$('abrirDados'),painelDados=$('painelDadosMenu'),fecharDados=$('fecharDados'),mensagemDados=$('mensagemDados'),resumoDados=$('resumoDados'),barrasDados=$('barrasDados'),historicoNomes=$('historicoNomes'),transicaoDados=$('transicaoDados'),textoTransicaoDados=$('textoTransicaoDados'),barraTransicaoDados=$('barraTransicaoDados'),cartaoMenu=e.menu.querySelector('.menu-cartao');
let inicioPartidaDados=0,partidaDadosAtiva=false,derrotaDadosRegistrada=false,transicaoDadosAtiva=false,ultimoDialogoDados='';
function carregarEstatisticas(){
  try{
    const dados=JSON.parse(localStorage.getItem('binoEstatisticas')||'{}');
    return {nomes:Array.isArray(dados.nomes)?dados.nomes:[],perfis:dados.perfis&&typeof dados.perfis==='object'?dados.perfis:{}};
  }catch(erro){return {nomes:[],perfis:{}}}
}
function salvarEstatisticas(dados){localStorage.setItem('binoEstatisticas',JSON.stringify(dados))}
function perfilEstatistico(nome,criar=false){
  const dados=carregarEstatisticas(),chave=limpar(nome);
  if(!chave)return {dados,perfil:null,chave:''};
  if(!dados.perfis[chave]&&criar)dados.perfis[chave]={partidas:0,derrotas:0,acertos:0,erros:0,tempoTotal:0,maiorTempo:0,maiorPontuacao:0,melhorSequencia:0};
  return {dados,perfil:dados.perfis[chave]||null,chave};
}
function registrarInicioPartida(){
  const nome=limpar(jogador||e.nome.value);if(!nome)return;
  const {dados,perfil}=perfilEstatistico(nome,true);
  perfil.partidas++;if(!dados.nomes.includes(nome))dados.nomes.push(nome);
  salvarEstatisticas(dados);inicioPartidaDados=Date.now();partidaDadosAtiva=true;derrotaDadosRegistrada=false;
}
function atualizarPerfilAtual(acao){
  const nome=limpar(jogador||e.nome.value),resultado=perfilEstatistico(nome,true);
  if(!resultado.perfil)return;
  acao(resultado.perfil);salvarEstatisticas(resultado.dados);
}
function registrarAcertoDados(){atualizarPerfilAtual(perfil=>perfil.acertos++)}
function registrarErroDados(){atualizarPerfilAtual(perfil=>perfil.erros++)}
function registrarDerrotaDados(){
  if(derrotaDadosRegistrada)return;
  derrotaDadosRegistrada=true;atualizarPerfilAtual(perfil=>perfil.derrotas++);
}
function registrarTempoPartida(){
  if(!partidaDadosAtiva||!inicioPartidaDados)return;
  const segundos=Math.max(0,Math.round((Date.now()-inicioPartidaDados)/1000));
  atualizarPerfilAtual(perfil=>{
    perfil.tempoTotal+=segundos;perfil.maiorTempo=Math.max(perfil.maiorTempo,segundos);
    perfil.maiorPontuacao=Math.max(perfil.maiorPontuacao,pontos);perfil.melhorSequencia=Math.max(perfil.melhorSequencia,melhorSequencia);
  });
  partidaDadosAtiva=false;inicioPartidaDados=0;
}
function tempoFormatado(segundos){const minutos=Math.floor(segundos/60),resto=segundos%60;return `${String(minutos).padStart(2,'0')}:${String(resto).padStart(2,'0')}`}
function criarItemDado(rotulo,valor){return `<article><span>${rotulo}</span><strong>${valor}</strong></article>`}
function renderizarDados(){
  const nome=limpar(e.nome.value)||limpar(jogador),{dados,perfil}=perfilEstatistico(nome);
  if(!perfil){
    mensagemDados.textContent='AINDA NAO HA DADOS SUFICIENTES. INICIE UMA MISSAO PARA GERAR ESTATISTICAS.';
    resumoDados.innerHTML='';barrasDados.innerHTML='<p class="dados-vazios">SEM RESPOSTAS REGISTRADAS</p>';
    historicoNomes.innerHTML=`<strong>NOMES USADOS NESTE NAVEGADOR:</strong> ${dados.nomes.length?dados.nomes.join(', '):'nenhum'}`;
    return false;
  }
  const total=perfil.acertos+perfil.erros,taxaAcerto=total?Math.round(perfil.acertos/total*100):0,taxaErro=total?Math.round(perfil.erros/total*100):0;
  mensagemDados.textContent=`PERFIL LOCAL: ${nome.toUpperCase()} // DADOS SALVOS NESTE NAVEGADOR.`;
  resumoDados.innerHTML=[
    criarItemDado('PARTIDAS',perfil.partidas),criarItemDado('DERROTAS',perfil.derrotas),
    criarItemDado('ACERTOS',perfil.acertos),criarItemDado('ERROS',perfil.erros),
    criarItemDado('TAXA DE ACERTO',`${taxaAcerto}%`),criarItemDado('TAXA DE ERRO',`${taxaErro}%`),
    criarItemDado('TEMPO TOTAL',tempoFormatado(perfil.tempoTotal)),criarItemDado('MAIOR TEMPO',tempoFormatado(perfil.maiorTempo)),
    criarItemDado('MAIOR PONTUACAO',perfil.maiorPontuacao),criarItemDado('MELHOR SEQUENCIA',perfil.melhorSequencia)
  ].join('');
  const maior=Math.max(1,perfil.acertos,perfil.erros);
  barrasDados.innerHTML=`<div class="barra-dado"><span>ACERTOS</span><i style="--largura:${perfil.acertos/maior*100}%;--cor:#b8ff2c"></i><b>${perfil.acertos} (${taxaAcerto}%)</b></div><div class="barra-dado"><span>ERROS</span><i style="--largura:${perfil.erros/maior*100}%;--cor:#ff8b63"></i><b>${perfil.erros} (${taxaErro}%)</b></div>`;
  historicoNomes.innerHTML=`<strong>NOMES USADOS NESTE NAVEGADOR:</strong> ${dados.nomes.length?dados.nomes.join(', '):'nenhum'}`;
  return total>0;
}
const falasDados={abrir:['Meus sensores estao procurando seus dados de missao.','Vamos analisar seu progresso, decodificador!','Dados locais encontrados. Preparando o terminal.','Cada bit decifrado deixa uma marca na sua jornada.','Estou calculando suas estatisticas digitais.'],bons:['Uau! Seus sensores de decodificacao estao muito ativos!','Essa sequencia de acertos foi impressionante!','Voce esta ficando cada vez melhor com os bits.','Muitos codigos foram decifrados por aqui!'],poucos:['Ainda temos poucos dados, mas toda grande missao comeca assim.','Jogue mais algumas transmissoes e teremos mais informacoes.','Meus arquivos estao prontos para receber novas descobertas.'],fechar:['Dados guardados com seguranca no terminal local.','Voltamos ao menu. Qual sera sua proxima missao?','Analise encerrada. Sistemas normais restaurados.']};
function falarDados(tipo){const opcoes=falasDados[tipo].filter(fala=>fala!==ultimoDialogoDados),falaEscolhida=opcoes[Math.floor(Math.random()*opcoes.length)];ultimoDialogoDados=falaEscolhida;falarMenu(falaEscolhida)}
function abrirPainelDados(){
  if(transicaoDadosAtiva||!painelDados.hidden)return;
  transicaoDadosAtiva=true;clique();falarDados('abrir');cartaoMenu.classList.add('monitor-trocando');transicaoDados.hidden=false;barraTransicaoDados.style.width='0%';
  const etapas=['ACESSANDO DADOS LOCAIS...','ANALISANDO MISSOES...','CALCULANDO ESTATISTICAS...','GERANDO GRAFICO...'];
  etapas.forEach((texto,indice)=>setTimeout(()=>{textoTransicaoDados.textContent=texto;barraTransicaoDados.style.width=`${25+indice*25}%`;if(efeitos){audio();tom(340+indice*70,.04,'square',.018)}},indice*230));
  setTimeout(()=>{renderizarDados();transicaoDados.hidden=true;cartaoMenu.classList.remove('monitor-trocando');cartaoMenu.classList.add('dados-abertos');painelDados.hidden=false;transicaoDadosAtiva=false;falarDados(resumoDados.children.length?'bons':'poucos');fecharDados.focus()},1040);
}
function fecharPainelDados(){
  if(transicaoDadosAtiva||painelDados.hidden)return;
  clique();painelDados.hidden=true;cartaoMenu.classList.remove('dados-abertos');cartaoMenu.classList.add('monitor-trocando');setTimeout(()=>cartaoMenu.classList.remove('monitor-trocando'),360);falarDados('fechar');botaoDados.focus();
}
botaoDados.addEventListener('click',abrirPainelDados);fecharDados.addEventListener('click',fecharPainelDados);
document.addEventListener('keydown',evento=>{if(evento.key==='Escape'&&!painelDados.hidden)fecharPainelDados()});
const iniciarJogoComEstatisticas=iniciarJogo;
iniciarJogo=function(){
  const nome=limpar(e.nome.value)||limpar(jogador);
  if(!nome)return iniciarJogoComEstatisticas();
  registrarInicioPartida();return iniciarJogoComEstatisticas();
};
const verificarRespostaComEstatisticas=verificarResposta;
verificarResposta=function(){
  if(partidaEncerrada)return verificarRespostaComEstatisticas();
  const acertou=limpar(e.resp.value)===atual;
  const resultado=verificarRespostaComEstatisticas();
  if(acertou)registrarAcertoDados();else registrarErroDados();
  return resultado;
};
const finalizarPartidaComEstatisticas=finalizarPartida;
finalizarPartida=function(){
  finalizarPartidaComEstatisticas();
  if(!e.derrota.hidden){registrarDerrotaDados();registrarTempoPartida()}
};
const mostrarMenuComEstatisticas=mostrarMenu;
mostrarMenu=function(){
  if(partidaDadosAtiva&&(estadoTela==='jogo'||estadoTela==='carregamento'))registrarTempoPartida();
  fecharPainelDados();return mostrarMenuComEstatisticas();
};

/* Decoracoes extras do terminal do menu: leves, aleatorias e apenas visuais. */
const criarDecoracoesMenuComTerminal=criarDecoracoesMenu;
criarDecoracoesMenu=function(){
  criarDecoracoesMenuComTerminal();
  if(e.decoracoes.querySelector('.faixa-binaria-menu'))return;
  const sequencias=['01000001 00110010 01101111','00110101 01000011 01101010','01110011 00100001 01010100','01001000 01001001 00100001','00110000 00110001 00110000'];
  sequencias.forEach((sequencia,indice)=>{
    const faixa=document.createElement('span');
    faixa.className='faixa-binaria-menu';faixa.textContent=sequencia;
    faixa.style.left=`${-7+Math.random()*88}%`;faixa.style.top=`${7+indice*18+Math.random()*7}%`;
    faixa.style.setProperty('--tempo',`${10+Math.random()*9}s`);e.decoracoes.append(faixa);
  });
  const terminais=['SINAL: ESTAVEL','BITS RECEBIDOS','MEMORIA: LOCAL','CANAL: ATIVO'];
  terminais.forEach((texto,indice)=>{
    const terminal=document.createElement('span');
    terminal.className='terminal-solto-menu';terminal.textContent=texto;
    terminal.style.left=indice%2?'auto':`${4+Math.random()*13}%`;
    terminal.style.right=indice%2?`${3+Math.random()*12}%`:'auto';
    terminal.style.top=`${12+indice*22+Math.random()*8}%`;
    terminal.style.setProperty('--tempo',`${3+Math.random()*3}s`);
    terminal.style.setProperty('--cor-terminal',['#b8ff2c','#58d7e9','#ffbe69','#b8ff2c'][indice]);
    e.decoracoes.append(terminal);
  });
};

/* Estatisticas detalhadas: ultima partida e velocidade real por dificuldade. */
const detalheDados=$('detalheDados'),voltarDetalheDados=$('voltarDetalheDados'),etiquetaDetalheDados=$('etiquetaDetalheDados'),tituloDetalheDados=$('tituloDetalheDados'),mensagemDetalheDados=$('mensagemDetalheDados'),conteudoDetalheDados=$('conteudoDetalheDados');
let inicioPerguntaDados=0,nivelPerguntaDados='',transicaoDetalheAtiva=false,ultimoDialogoDetalhe='';
const carregarEstatisticasAnterior=carregarEstatisticas;
carregarEstatisticas=function(){
  const dados=carregarEstatisticasAnterior();
  Object.values(dados.perfis).forEach(perfil=>{
    perfil.partidas=Number(perfil.partidas)||0;perfil.derrotas=Number(perfil.derrotas)||0;perfil.acertos=Number(perfil.acertos)||0;perfil.erros=Number(perfil.erros)||0;
    perfil.tempoTotal=Number(perfil.tempoTotal)||0;perfil.maiorTempo=Number(perfil.maiorTempo)||0;perfil.maiorPontuacao=Number(perfil.maiorPontuacao)||0;perfil.melhorSequencia=Number(perfil.melhorSequencia)||0;
    perfil.tempos=perfil.tempos&&typeof perfil.tempos==='object'?perfil.tempos:{};
    ['facil','medio','dificil'].forEach(nivel=>{const registro=perfil.tempos[nivel]||{};perfil.tempos[nivel]={quantidade:Number(registro.quantidade)||0,soma:Number(registro.soma)||0,historico:Array.isArray(registro.historico)?registro.historico.filter(valor=>Number.isFinite(Number(valor))).slice(-20):[]}});
  });
  return dados;
};
function nivelNormalizadoDados(nivel){return limpar(nivel).replace('í','i')}
function registrarInicioPerguntaDados(){
  if(estadoTela!=='jogo'||!atual)return;
  inicioPerguntaDados=Date.now();nivelPerguntaDados=nivelNormalizadoDados(e.nivel.textContent);
}
function registrarTempoRespostaDados(){
  if(!inicioPerguntaDados||!nivelPerguntaDados||!partidaDadosAtiva)return;
  const segundos=Math.max(1,Math.round((Date.now()-inicioPerguntaDados)/1000));
  const nivel=['facil','medio','dificil'].includes(nivelPerguntaDados)?nivelPerguntaDados:'facil';
  atualizarPerfilAtual(perfil=>{
    const registro=perfil.tempos[nivel];registro.quantidade++;registro.soma+=segundos;registro.historico.push(segundos);registro.historico=registro.historico.slice(-20);
  });
  inicioPerguntaDados=0;nivelPerguntaDados='';
}
function salvarUltimaPartidaDados(){
  if(!jogador)return;
  atualizarPerfilAtual(perfil=>{perfil.ultimaPartida=new Date().toISOString()});
}
function tempoDecorridoDados(data){
  const diferenca=Math.max(0,Date.now()-new Date(data).getTime()),minutos=Math.floor(diferenca/60000),horas=Math.floor(minutos/60),dias=Math.floor(horas/24);
  if(dias)return `ha ${dias} ${dias===1?'dia':'dias'}`;
  if(horas)return `ha ${horas} ${horas===1?'hora':'horas'}`;
  if(minutos)return `ha ${minutos} ${minutos===1?'minuto':'minutos'}`;
  return 'ha poucos segundos';
}
function ultimaPartidaFormatada(data){
  if(!data)return 'NENHUMA PARTIDA REGISTRADA AINDA.';
  const dataObjeto=new Date(data);
  if(Number.isNaN(dataObjeto.getTime()))return 'NENHUMA PARTIDA REGISTRADA AINDA.';
  const dataFormatada=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',weekday:'long'}).format(dataObjeto);
  const horario=new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit'}).format(dataObjeto);
  return `${dataFormatada} · ${horario} · ${tempoDecorridoDados(data)}`;
}
function mediaTempoDados(registro){return registro&&registro.quantidade?tempoFormatado(Math.round(registro.soma/registro.quantidade)):'SEM DADOS'}
const chaveDetalhePorRotulo={'PARTIDAS':'partidas','DERROTAS':'partidas','ACERTOS':'acertos','ERROS':'acertos','TEMPO DE RESPOSTA':'tempo','ULTIMA PARTIDA':'ultima','MAIOR PONTUACAO':'pontuacao','MELHOR SEQUENCIA':'pontuacao'};
criarItemDado=function(rotulo,valor){const chave=chaveDetalhePorRotulo[rotulo]||'acertos';return `<button type="button" class="item-dado" data-detalhe="${chave}"><span>${rotulo}</span><strong>${valor}</strong></button>`};
renderizarDados=function(){
  const nome=limpar(e.nome.value)||limpar(jogador),{dados,perfil}=perfilEstatistico(nome);
  if(!perfil){
    mensagemDados.textContent='AINDA NAO HA DADOS SUFICIENTES. INICIE UMA MISSAO PARA GERAR ESTATISTICAS.';
    resumoDados.innerHTML='';barrasDados.innerHTML='<p class="dados-vazios">SEM RESPOSTAS REGISTRADAS</p>';
    historicoNomes.innerHTML=`<strong>NOMES USADOS NESTE NAVEGADOR:</strong> ${dados.nomes.length?dados.nomes.join(', '):'nenhum'}`;return false;
  }
  const total=perfil.acertos+perfil.erros,taxaAcerto=total?Math.round(perfil.acertos/total*100):0,taxaErro=total?Math.round(perfil.erros/total*100):0;
  mensagemDados.textContent=`PERFIL LOCAL: ${nome.toUpperCase()} // DADOS SALVOS NESTE NAVEGADOR.`;
  resumoDados.innerHTML=[
    criarItemDado('PARTIDAS',perfil.partidas),criarItemDado('DERROTAS',perfil.derrotas),criarItemDado('ACERTOS',perfil.acertos),criarItemDado('ERROS',perfil.erros),
    criarItemDado('TAXA DE ACERTO',`${taxaAcerto}%`),criarItemDado('TAXA DE ERRO',`${taxaErro}%`),
    criarItemDado('TEMPO TOTAL',tempoFormatado(perfil.tempoTotal)),criarItemDado('MAIOR TEMPO',tempoFormatado(perfil.maiorTempo)),
    criarItemDado('TEMPO DE RESPOSTA',`${mediaTempoDados(perfil.tempos.facil)} / ${mediaTempoDados(perfil.tempos.medio)} / ${mediaTempoDados(perfil.tempos.dificil)}`),
    criarItemDado('ULTIMA PARTIDA',perfil.ultimaPartida?tempoDecorridoDados(perfil.ultimaPartida):'SEM DADOS'),
    criarItemDado('MAIOR PONTUACAO',perfil.maiorPontuacao),criarItemDado('MELHOR SEQUENCIA',perfil.melhorSequencia)
  ].join('');
  const maior=Math.max(1,perfil.acertos,perfil.erros);
  barrasDados.innerHTML=`<div class="barra-dado"><span>ACERTOS</span><i style="--largura:${perfil.acertos/maior*100}%;--cor:#b8ff2c"></i><b>${perfil.acertos} (${taxaAcerto}%)</b></div><div class="barra-dado"><span>ERROS</span><i style="--largura:${perfil.erros/maior*100}%;--cor:#ff8b63"></i><b>${perfil.erros} (${taxaErro}%)</b></div>`;
  historicoNomes.innerHTML=`<strong>NOMES USADOS NESTE NAVEGADOR:</strong> ${dados.nomes.length?dados.nomes.join(', '):'nenhum'}`;return total>0;
};
function falarDetalheDados(lista){const opcoes=lista.filter(fala=>fala!==ultimoDialogoDetalhe),fala=opcoes[Math.floor(Math.random()*opcoes.length)];ultimoDialogoDetalhe=fala;falarMenu(fala)}
const falasTempoDados=['Estou medindo a velocidade dos seus sensores de decodificacao.','Cada transmissao deixa uma marca no seu tempo de resposta.','Os dados mostram como voce enfrenta cada nivel.','Vamos comparar os sinais facil, medio e dificil.','Meus circuitos terminaram a analise de velocidade.'];
const falasGraficoDados=['Transformando seus bits em um grafico digital.','Essas linhas contam a historia das suas transmissoes.','Dados organizados. Seus sensores podem analisar tudo agora.','Cada ponto representa uma tentativa real.'];
const falasPoucosDados=['Ainda precisamos de mais transmissoes para formar um grafico completo.','Continue jogando e os dados ficarao mais interessantes.','Meus arquivos ainda estao recebendo informacoes.'];
function desenharGraficoTempo(perfil){
  const linhas=[['FACIL',perfil.tempos.facil.historico,'#b8ff2c'],['MEDIO',perfil.tempos.medio.historico,'#ffbe69'],['DIFICIL',perfil.tempos.dificil.historico,'#ff5d55']].filter(([,historico])=>historico.length);
  if(!linhas.length)return '<p class="dados-vazios">DADOS INSUFICIENTES PARA GERAR O GRAFICO.</p>';
  const maximo=Math.max(1,...linhas.flatMap(([,historico])=>historico)),largura=380,altura=215,esquerda=46,topo=24,base=166,areaLargura=306,alturaUtil=125;
  const grade=[0,1,2,3,4].map(indice=>{const y=topo+indice*(alturaUtil/4),valor=Math.round(maximo-(maximo/4*indice));return `<line class="grade-grafico" x1="${esquerda}" x2="${esquerda+areaLargura}" y1="${y}" y2="${y}"/><text class="eixo-grafico" x="4" y="${y+3}">${valor}s</text>`}).join('');
  const caminhos=linhas.map(([nome,historico,cor])=>{const pontos=historico.map((valor,indice)=>{const x=esquerda+(historico.length===1?areaLargura/2:indice*areaLargura/(historico.length-1)),y=base-(valor/maximo*alturaUtil);return [x,y,valor]});const linha=pontos.map((ponto,indice)=>`${indice?'L':'M'}${ponto[0].toFixed(1)},${ponto[1].toFixed(1)}`).join('');const area=`M${pontos[0][0]},${base} ${pontos.map(ponto=>`L${ponto[0].toFixed(1)},${ponto[1].toFixed(1)}`).join(' ')} L${pontos.at(-1)[0]},${base} Z`;const ultimo=pontos.at(-1);return `<path d="${area}" fill="${cor}1c"/><path d="${linha}" fill="none" stroke="${cor}" stroke-width="2.4"/>${pontos.map(ponto=>`<circle cx="${ponto[0]}" cy="${ponto[1]}" r="3.4" fill="${cor}"/>`).join('')}<text class="rotulo-ponto-grafico" x="${ultimo[0]+5}" y="${ultimo[1]-6}" fill="${cor}">${ultimo[2]}s</text>`}).join('');
  return `<p class="ajuda-grafico">TEMPO EM SEGUNDOS · CADA PONTO É UMA RESPOSTA REGISTRADA</p><div class="legenda-grafico">${linhas.map(([nome,historico,cor])=>`<span><i style="--cor:${cor}"></i>${nome}: ${Math.round(historico.reduce((soma,valor)=>soma+valor,0)/historico.length)}s EM MÉDIA</span>`).join('')}</div><svg class="grafico-linhas" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="Tempos recentes por dificuldade">${grade}<line class="grade-grafico" x1="${esquerda}" x2="${esquerda+areaLargura}" y1="${base}" y2="${base}"/><text class="eixo-grafico" x="${esquerda}" y="190">RESPOSTAS MAIS RECENTES</text>${caminhos}</svg>`;
}
function desenharResumoDetalhe(perfil,tipo){
  if(tipo==='ultima')return `<div class="resumo-detalhe"><p><strong>ULTIMA PARTIDA</strong>${ultimaPartidaFormatada(perfil.ultimaPartida)}</p><p><strong>STATUS</strong>${perfil.ultimaPartida?'DADOS LOCAIS SALVOS COM SUCESSO.':'NENHUMA PARTIDA REGISTRADA AINDA.'}</p></div>`;
  const valores=tipo==='partidas'?[['PARTIDAS',perfil.partidas],['DERROTAS',perfil.derrotas]]:tipo==='pontuacao'?[['MAIOR PONTUACAO',perfil.maiorPontuacao],['MELHOR SEQUENCIA',perfil.melhorSequencia]]:[['ACERTOS',perfil.acertos],['ERROS',perfil.erros]];
  const maior=Math.max(1,...valores.map(([,valor])=>valor));
  return `<div class="legenda-grafico"><span><i style="--cor:#b8ff2c"></i>DADOS REAIS</span></div>${valores.map(([nome,valor],indice)=>`<div class="barra-dado"><span>${nome}</span><i style="--largura:${valor/maior*100}%;--cor:${indice?'#ff8b63':'#b8ff2c'}"></i><b>${valor}</b></div>`).join('')}`;
}
function iniciarTransicaoDetalhe(mensagem,concluir){
  if(transicaoDetalheAtiva)return;
  transicaoDetalheAtiva=true;cartaoMenu.classList.add('monitor-trocando');transicaoDados.hidden=false;textoTransicaoDados.textContent=mensagem;barraTransicaoDados.style.width='18%';
  setTimeout(()=>{barraTransicaoDados.style.width='68%';if(efeitos){audio();tom(430,.04,'square',.018)}},190);
  setTimeout(()=>{barraTransicaoDados.style.width='100%';if(efeitos){audio();tom(620,.05,'square',.02)}},390);
  setTimeout(()=>{transicaoDados.hidden=true;cartaoMenu.classList.remove('monitor-trocando');transicaoDetalheAtiva=false;concluir()},650);
}
function abrirDetalheDados(tipo){
  if(transicaoDetalheAtiva)return;
  const nome=limpar(e.nome.value)||limpar(jogador),{perfil}=perfilEstatistico(nome);
  if(!perfil){falarDetalheDados(falasPoucosDados);return}
  const titulos={tempo:'TEMPO DE RESPOSTA',acertos:'ACERTOS E ERROS',partidas:'PARTIDAS E DERROTAS',ultima:'ULTIMA PARTIDA',pontuacao:'RECORDES DA MISSAO'};
  iniciarTransicaoDetalhe('CARREGANDO ANALISE DETALHADA...',()=>{
    etiquetaDetalheDados.textContent='TERMINAL DE ANALISE DIGITAL';tituloDetalheDados.textContent=titulos[tipo]||'DADOS DETALHADOS';
    if(tipo==='tempo'){
      mensagemDetalheDados.textContent='TEMPO MEDIO PARA RESPONDER CADA TRANSMISSAO, SEPARADO POR DIFICULDADE.';
      conteudoDetalheDados.innerHTML=desenharGraficoTempo(perfil);falarDetalheDados(perfil.tempos.facil.quantidade||perfil.tempos.medio.quantidade||perfil.tempos.dificil.quantidade?falasTempoDados:falasPoucosDados);
    }else{
      mensagemDetalheDados.textContent=tipo==='ultima'?'REGISTRO LOCAL DA ULTIMA MISSAO ENCERRADA.':'COMPARACAO BASEADA SOMENTE EM DADOS REAIS DESTE NAVEGADOR.';
      conteudoDetalheDados.innerHTML=desenharResumoDetalhe(perfil,tipo);falarDetalheDados(tipo==='ultima'&&!perfil.ultimaPartida?falasPoucosDados:falasGraficoDados);
    }
    painelDados.classList.add('detalhe-aberto');detalheDados.hidden=false;voltarDetalheDados.focus();
  });
}
function fecharDetalheDados(){
  if(transicaoDetalheAtiva||detalheDados.hidden)return;
  iniciarTransicaoDetalhe('RETORNANDO AO TERMINAL DE DADOS...',()=>{detalheDados.hidden=true;painelDados.classList.remove('detalhe-aberto');renderizarDados();botaoDados.focus()});
}
resumoDados.addEventListener('click',evento=>{const cartao=evento.target.closest('[data-detalhe]');if(cartao)abrirDetalheDados(cartao.dataset.detalhe)});
voltarDetalheDados.addEventListener('click',fecharDetalheDados);
const gerarPuzzleComTemposDados=gerarPuzzleAleatorio;
gerarPuzzleAleatorio=function(){gerarPuzzleComTemposDados();registrarInicioPerguntaDados()};
const verificarRespostaComTempoDados=verificarResposta;
verificarResposta=function(){
  const deveRegistrar=!partidaEncerrada&&Boolean(atual)&&Boolean(inicioPerguntaDados);
  if(deveRegistrar)registrarTempoRespostaDados();
  return verificarRespostaComTempoDados();
};
const finalizarPartidaComUltimaData=finalizarPartida;
finalizarPartida=function(){finalizarPartidaComUltimaData();if(!e.derrota.hidden)salvarUltimaPartidaDados()};
const mostrarMenuComUltimaData=mostrarMenu;
mostrarMenu=function(){
  const estavaEmPartida=partidaDadosAtiva&&(estadoTela==='jogo'||estadoTela==='carregamento');
  if(estavaEmPartida)salvarUltimaPartidaDados();
  return mostrarMenuComUltimaData();
};
const fecharPainelDadosComDetalhe=fecharPainelDados;
fecharPainelDados=function(){
  detalheDados.hidden=true;painelDados.classList.remove('detalhe-aberto');
  return fecharPainelDadosComDetalhe();
};

/* Guia do jogo: manual retro dentro do proprio monitor do menu. */
const painelComoMenu=$('painelComoMenu'),fecharComoMenu=$('fecharComoMenu');
let transicaoGuiaAtiva=false,ultimaFalaGuia='';
const falasAbrirGuia=['Vou explicar tudo antes da proxima transmissao.','Cada grupo de oito bits guarda uma letra escondida.','Use o guia com calma. Seus sensores aprendem rapido!','Preparado para entender os segredos do sistema binario?','Este manual foi aprovado pelos meus circuitos.'];
const falasFecharGuia=['Guia encerrado. Agora voce esta pronto para decodificar!','Se precisar, o manual estara aqui no terminal.','Vamos transformar esses bits em descobertas!'];
function falarGuia(lista){const opcoes=lista.filter(fala=>fala!==ultimaFalaGuia),fala=opcoes[Math.floor(Math.random()*opcoes.length)];ultimaFalaGuia=fala;falarMenu(fala)}
function transicaoMonitorGuia(mensagens,concluir){
  if(transicaoGuiaAtiva)return;
  transicaoGuiaAtiva=true;cartaoMenu.classList.add('monitor-trocando');transicaoDados.hidden=false;barraTransicaoDados.style.width='0%';
  mensagens.forEach((mensagem,indice)=>setTimeout(()=>{textoTransicaoDados.textContent=mensagem;barraTransicaoDados.style.width=`${25+indice*25}%`;if(efeitos){audio();tom(320+indice*85,.04,'square',.018)}},indice*210));
  setTimeout(()=>{transicaoDados.hidden=true;cartaoMenu.classList.remove('monitor-trocando');transicaoGuiaAtiva=false;concluir()},980);
}
function abrirComoMenu(){
  if(transicaoGuiaAtiva||!painelComoMenu.hidden)return;
  clique();falarGuia(falasAbrirGuia);
  transicaoMonitorGuia(['CARREGANDO MANUAL DO DECODIFICADOR...','ANALISANDO ALFABETO BINARIO...','PREPARANDO GUIA DE MISSAO...','SISTEMA DE AJUDA PRONTO.'],()=>{cartaoMenu.classList.add('como-aberto');painelComoMenu.hidden=false;fecharComoMenu.focus()});
}
function fecharComoMenuFuncao(){
  if(transicaoGuiaAtiva||painelComoMenu.hidden)return;
  clique();transicaoMonitorGuia(['ENCERRANDO MANUAL...','RESTAURANDO TERMINAL PRINCIPAL...','SISTEMA PRONTO.','MENU DISPONIVEL.'],()=>{painelComoMenu.hidden=true;cartaoMenu.classList.remove('como-aberto');falarGuia(falasFecharGuia);e.como.focus()});
}
e.como.onclick=abrirComoMenu;fecharComoMenu.addEventListener('click',fecharComoMenuFuncao);
document.addEventListener('keydown',evento=>{if(evento.key==='Escape'&&!painelComoMenu.hidden)fecharComoMenuFuncao()});

/* Fita visual de Turing: acompanha os eventos do puzzle sem tocar no B.I.N.O. */
const maquinaTuring=$('maquinaTuring');
let temporizadorTuring=0;
function sinalizarTuring(tipo){
  if(!maquinaTuring)return;
  clearTimeout(temporizadorTuring);
  maquinaTuring.classList.remove('turing-recebendo','turing-acerto','turing-erro','turing-dica','turing-revelar','turing-sinal');
  void maquinaTuring.offsetWidth;maquinaTuring.classList.add(`turing-${tipo}`);
  temporizadorTuring=setTimeout(()=>maquinaTuring.classList.remove(`turing-${tipo}`),tipo==='recebendo'?1300:950);
}
const gerarPuzzleComTuring=gerarPuzzleAleatorio;
gerarPuzzleAleatorio=function(){const resultado=gerarPuzzleComTuring();sinalizarTuring('recebendo');return resultado};
const verificarRespostaComTuring=verificarResposta;
verificarResposta=function(){
  const acertou=!partidaEncerrada&&limpar(e.resp.value)===atual;
  const resultado=verificarRespostaComTuring();sinalizarTuring(acertou?'acerto':'erro');return resultado;
};
e.dica.addEventListener('click',()=>{if(pontos>=25)sinalizarTuring('dica')});
document.getElementById('botaoRevelarLetra')?.addEventListener('click',()=>{if(pontos>=200)sinalizarTuring('revelar')});
e.dica.addEventListener('click',()=>{if(pontos>=25)sinalizarTuring('dica')},true);
document.getElementById('botaoRevelarLetra')?.addEventListener('click',()=>{if(pontos>=200)sinalizarTuring('revelar')},true);
document.getElementById('botaoPular')?.addEventListener('click',()=>{if(pontos>=125)sinalizarTuring('recebendo')},true);
const liberarTransmissaoComTuring=liberarTransmissaoOculta;
liberarTransmissaoOculta=function(){const resultado=liberarTransmissaoComTuring();sinalizarTuring('sinal');return resultado};

/* Fita de Turing refinada: canal, nivel e recebimento visual de dados. */
const statusTuring=$('statusTuring'),recebimentoTuring=$('recebimentoTuring');
let canalTuring=1,canalTuringRaro=false,temporizadorCanalTuring=0,temporizadorRecebimentoTuring=0,temporizadorNivelTuring=0;
function numeroCanalTuring(){let proximo=canalTuring;while(proximo===canalTuring)proximo=1+Math.floor(Math.random()*99);return proximo}
function textoCanalTuring(){return canalTuringRaro?'FITA DE TURING // CANAL OCULTO 77 · SINAL RARO':'FITA DE TURING // CANAL '+String(canalTuring).padStart(2,'0')+' · CABEÇA LEITORA: ATIVA'}
function atualizarCanalTuring(raro=false){
  if(!maquinaTuring||!statusTuring)return;
  clearTimeout(temporizadorCanalTuring);canalTuringRaro=raro;
  if(!raro)canalTuring=numeroCanalTuring();
  maquinaTuring.classList.remove('canal-raro');maquinaTuring.classList.add('canal-trocando');statusTuring.textContent='ATUALIZANDO CANAL...';
  if(efeitos){audio();tom(raro?660:510,.045,'square',.018)}
  temporizadorCanalTuring=setTimeout(()=>{statusTuring.textContent=textoCanalTuring();maquinaTuring.classList.remove('canal-trocando');maquinaTuring.classList.toggle('canal-raro',raro)},260);
}
function atualizarNivelTuring(){
  const nivelNovo=limpar(e.nivel.textContent);
  if(!['facil','medio','dificil'].includes(nivelNovo))return;
  clearTimeout(temporizadorNivelTuring);e.nivel.classList.remove('nivel-entrada');e.nivel.classList.add('nivel-atualizando');e.nivel.textContent='ATUALIZANDO NIVEL...';
  temporizadorNivelTuring=setTimeout(()=>{e.nivel.textContent=nivelNovo.toUpperCase();e.nivel.dataset.nivelTuring=nivelNovo;e.nivel.classList.remove('nivel-atualizando');void e.nivel.offsetWidth;e.nivel.classList.add('nivel-entrada');if(efeitos){audio();tom(nivelNovo==='facil'?430:nivelNovo==='medio'?520:610,.032,'square',.014)}},260);
}
function receberDadosTuring(){
  if(!maquinaTuring||!recebimentoTuring)return;
  clearTimeout(temporizadorRecebimentoTuring);recebimentoTuring.innerHTML='';maquinaTuring.classList.remove('turing-estatica');maquinaTuring.classList.add('turing-carregando');
  const grupos=['01','10','001','101','010','110','011','100'];
  grupos.forEach((grupo,indice)=>{const bit=document.createElement('span');bit.textContent=grupo;bit.style.left=`${5+Math.random()*83}%`;bit.style.top=`${3+Math.random()*52}%`;bit.style.animationDelay=`${indice*42}ms`;recebimentoTuring.append(bit);if(efeitos&&indice%3===0){audio();tom(300+indice*38,.025,'square',.01,indice*.04)}});
  temporizadorRecebimentoTuring=setTimeout(()=>{maquinaTuring.classList.remove('turing-carregando');maquinaTuring.classList.add('turing-estatica');if(efeitos){audio();tom(210,.045,'square',.014)}},380);
  temporizadorRecebimentoTuring=setTimeout(()=>{recebimentoTuring.innerHTML='';maquinaTuring.classList.remove('turing-estatica')},660);
}
const gerarPuzzleComRecebimentoTuring=gerarPuzzleAleatorio;
gerarPuzzleAleatorio=function(){
  const resultado=gerarPuzzleComRecebimentoTuring();
  if(canalTuringRaro)atualizarCanalTuring(false);
  atualizarNivelTuring();receberDadosTuring();return resultado;
};
const verificarRespostaComCanalTuring=verificarResposta;
verificarResposta=function(){
  const acertou=!partidaEncerrada&&limpar(e.resp.value)===atual;
  const resultado=verificarRespostaComCanalTuring();if(acertou)atualizarCanalTuring(false);return resultado;
};
const verificarSinalComCanalTuring=verificarSinal;
verificarSinal=function(){
  const resolveu=Boolean(missao)&&limpar(e.respSinal.value)===missao;
  const resultado=verificarSinalComCanalTuring();if(resolveu)atualizarCanalTuring(true);return resultado;
};

/* Carregamento retro antes de mostrar o menu, tanto na abertura quanto no retorno. */
const menuMobile=$('menuMobile');
let carregamentoMenuAtivo=false,temporizadorCarregamentoMenu=0;
const mostrarMenuSemCarregamento=mostrarMenu;
function mostrarCarregamentoDoMenu(){
  if(carregamentoMenuAtivo)return;
  carregamentoMenuAtivo=true;clearTimeout(temporizadorCarregamentoMenu);pausarFaixa(e.audioJogo);limparDecoracoesMenu();
  estadoTela='carregamento';ocultarTodasAsTelas();e.carregamento.hidden=false;ajustarRolagem();
  e.textoCarregamento.textContent='INICIALIZANDO TERMINAL DO MENU...';
  iniciarTerminalCarregamento();
  temporizadorCarregamentoMenu=setTimeout(()=>{
    limparTerminalCarregamento();carregamentoMenuAtivo=false;mostrarMenuSemCarregamento();
  },2050);
}
mostrarMenu=function(){mostrarCarregamentoDoMenu()};
menuMobile?.addEventListener('click',()=>mostrarMenu());
setTimeout(mostrarCarregamentoDoMenu,0);

/* Preferencias iniciais e painel de configuracoes do menu. */
const abrirConfiguracoes=$('abrirConfiguracoes'),painelConfiguracoes=$('painelConfiguracoes'),fecharConfiguracoes=$('fecharConfiguracoes'),configMusica=$('configMusica'),configEfeitos=$('configEfeitos'),configBino=$('configBino'),volumeConfig=$('volumeConfig'),valorVolumeConfig=$('valorVolumeConfig');
let configuracoesEmTransicao=false;
function sincronizarConfiguracoes(){
  configMusica.textContent=`MÚSICA: ${ligada?'LIGADA':'DESLIGADA'}`;
  configEfeitos.textContent=`EFEITOS: ${efeitos?'LIGADOS':'DESLIGADOS'}`;
  configBino.textContent=`SOM B.I.N.O.: ${voz?'LIGADO':'DESLIGADO'}`;
  volumeConfig.value=e.volume.value;valorVolumeConfig.textContent=`${e.volume.value}%`;
}
ligada=true;e.musicaMenu=configMusica;e.musica.textContent='MÚSICA: LIGADA';sincronizarConfiguracoes();
document.addEventListener('pointerdown',()=>{if(ligada&&estadoTela==='menu'&&e.audioMenu.paused)tocarFaixa(e.audioMenu)},{once:true});
configMusica.addEventListener('click',()=>{alternarMusica();sincronizarConfiguracoes()});
configEfeitos.addEventListener('click',()=>{e.efeitos.click();sincronizarConfiguracoes()});
configBino.addEventListener('click',()=>{e.voz.click();sincronizarConfiguracoes()});
volumeConfig.addEventListener('input',()=>{e.volume.value=volumeConfig.value;e.volume.oninput();sincronizarConfiguracoes()});
function abrirPainelConfiguracoes(){
  if(configuracoesEmTransicao||!painelConfiguracoes.hidden)return;
  configuracoesEmTransicao=true;clique();falarMenu('Painel de configuracoes aberto. Ajuste os sons do terminal como preferir.');
  transicaoMonitorGuia(['ACESSANDO CONFIGURACOES LOCAIS...','VERIFICANDO CANAIS DE AUDIO...','CALIBRANDO CONTROLES...','PAINEL DE CONTROLE PRONTO.'],()=>{cartaoMenu.classList.add('configuracoes-abertas');painelConfiguracoes.hidden=false;configuracoesEmTransicao=false;sincronizarConfiguracoes();fecharConfiguracoes.focus()});
}
function fecharPainelConfiguracoes(){
  if(configuracoesEmTransicao||painelConfiguracoes.hidden)return;
  configuracoesEmTransicao=true;clique();transicaoMonitorGuia(['SALVANDO AJUSTES LOCAIS...','RESTAURANDO TERMINAL PRINCIPAL...','SISTEMA PRONTO.','MENU DISPONIVEL.'],()=>{painelConfiguracoes.hidden=true;cartaoMenu.classList.remove('configuracoes-abertas');configuracoesEmTransicao=false;falarMenu('Configuracoes guardadas. O terminal esta pronto para a proxima missao.');abrirConfiguracoes.focus()});
}
abrirConfiguracoes.addEventListener('click',abrirPainelConfiguracoes);fecharConfiguracoes.addEventListener('click',fecharPainelConfiguracoes);
document.addEventListener('keydown',evento=>{if(evento.key==='Escape'&&!painelConfiguracoes.hidden)fecharPainelConfiguracoes()});

/* Sequencia diaria local: uma partida em cada dia mantem a chama acesa. */
function chaveDiaLocal(data=new Date()){return `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,'0')}-${String(data.getDate()).padStart(2,'0')}`}
function diferencaDiasLocais(anterior,atual=chaveDiaLocal()){
  if(!anterior)return Infinity;
  const [anoA,mesA,diaA]=anterior.split('-').map(Number),[anoB,mesB,diaB]=atual.split('-').map(Number);
  return Math.round((Date.UTC(anoB,mesB-1,diaB)-Date.UTC(anoA,mesA-1,diaA))/86400000);
}
function sequenciaDiariaAtual(perfil){
  if(!perfil?.ultimoDiaJogado)return 0;
  return diferencaDiasLocais(perfil.ultimoDiaJogado)<=1?Number(perfil.sequenciaDiaria)||0:0;
}
function registrarSequenciaDiaria(){
  atualizarPerfilAtual(perfil=>{
    const hoje=chaveDiaLocal(),diferenca=diferencaDiasLocais(perfil.ultimoDiaJogado,hoje);
    if(!perfil.ultimoDiaJogado||diferenca>1)perfil.sequenciaDiaria=1;
    else if(diferenca===1)perfil.sequenciaDiaria=(Number(perfil.sequenciaDiaria)||0)+1;
    else perfil.sequenciaDiaria=Number(perfil.sequenciaDiaria)||1;
    perfil.ultimoDiaJogado=hoje;perfil.maiorSequenciaDiaria=Math.max(Number(perfil.maiorSequenciaDiaria)||0,perfil.sequenciaDiaria);
  });
}
const registrarInicioPartidaComSequenciaDiaria=registrarInicioPartida;
registrarInicioPartida=function(){const resultado=registrarInicioPartidaComSequenciaDiaria();registrarSequenciaDiaria();return resultado};
const renderizarDadosComSequenciaDiaria=renderizarDados;
renderizarDados=function(){
  const resultado=renderizarDadosComSequenciaDiaria();
  const nome=limpar(e.nome.value)||limpar(jogador),{perfil}=perfilEstatistico(nome);
  if(!perfil)return resultado;
  const sequencia=sequenciaDiariaAtual(perfil),cartao=document.createElement('button');
  cartao.type='button';cartao.className=`item-dado sequencia-diaria ${sequencia?'chama-acesa':'chama-apagada'}`;cartao.dataset.detalhe='sequencia';
  cartao.innerHTML=`<span>SEQUENCIA DIARIA</span><strong><i class="chama-diaria" aria-hidden="true">&#128293;</i>${sequencia} ${sequencia===1?'DIA':'DIAS'}</strong>`;
  resumoDados.prepend(cartao);return resultado;
};

/* Graficos individuais para cada cartao do terminal de Dados. */
Object.assign(chaveDetalhePorRotulo,{
  'TAXA DE ACERTO':'taxas','TAXA DE ERRO':'taxas','TEMPO TOTAL':'duracao','MAIOR TEMPO':'duracao',
  'SEQUENCIA DIARIA':'sequencia'
});
function desenharGraficoBarrasDetalhe(itens,unidade='UNIDADES'){
  const dados=itens.map(([nome,valor,cor])=>[nome,Math.max(0,Number(valor)||0),cor]);
  const maior=Math.max(1,...dados.map(([,valor])=>valor)),largura=380,altura=215,esquerda=45,base=166,areaLargura=310,alturaUtil=120;
  const passo=areaLargura/dados.length,larguraBarra=Math.min(52,passo*.58);
  const grade=[0,1,2,3].map(indice=>{const y=46+indice*(alturaUtil/3);return `<line class="grade-grafico" x1="${esquerda}" x2="${esquerda+areaLargura}" y1="${y}" y2="${y}"/>`}).join('');
  const barras=dados.map(([nome,valor,cor],indice)=>{const alturaBarra=Math.max(valor?4:0,valor/maior*alturaUtil),x=esquerda+passo*indice+(passo-larguraBarra)/2,y=base-alturaBarra;return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${larguraBarra.toFixed(1)}" height="${alturaBarra.toFixed(1)}" rx="2" fill="${cor}" opacity=".82"/><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${larguraBarra.toFixed(1)}" height="3" rx="1" fill="#efffe7"/><text class="rotulo-ponto-grafico" x="${(x+larguraBarra/2).toFixed(1)}" y="${Math.max(20,y-7).toFixed(1)}" text-anchor="middle" fill="${cor}">${valor}</text><text class="eixo-grafico" x="${(x+larguraBarra/2).toFixed(1)}" y="190" text-anchor="middle">${nome}</text>`}).join('');
  return `<p class="ajuda-grafico">${unidade} · DADOS REAIS SALVOS NESTE NAVEGADOR</p><div class="legenda-grafico">${dados.map(([nome,valor,cor])=>`<span><i style="--cor:${cor}"></i>${nome}: ${valor}</span>`).join('')}</div><svg class="grafico-linhas" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="Grafico detalhado de dados">${grade}<line class="grade-grafico" x1="${esquerda}" x2="${esquerda+areaLargura}" y1="${base}" y2="${base}"/>${barras}</svg>`;
}
function graficoEspecificoDados(perfil,tipo){
  const total=perfil.acertos+perfil.erros,taxaAcerto=total?Math.round(perfil.acertos/total*100):0,taxaErro=total?Math.round(perfil.erros/total*100):0;
  const mediaPartida=perfil.partidas?Math.round(perfil.tempoTotal/perfil.partidas):0;
  if(tipo==='partidas')return desenharGraficoBarrasDetalhe([['PARTIDAS',perfil.partidas,'#b8ff2c'],['DERROTAS',perfil.derrotas,'#ff8b63'],['CONCLUIDAS',Math.max(0,perfil.partidas-perfil.derrotas),'#58d7e9']]);
  if(tipo==='acertos')return desenharGraficoBarrasDetalhe([['ACERTOS',perfil.acertos,'#b8ff2c'],['ERROS',perfil.erros,'#ff8b63'],['TOTAL',total,'#ffbe69']]);
  if(tipo==='taxas')return desenharGraficoBarrasDetalhe([['ACERTO',taxaAcerto,'#b8ff2c'],['ERRO',taxaErro,'#ff5d55']],'PORCENTAGEM');
  if(tipo==='duracao')return desenharGraficoBarrasDetalhe([['TOTAL',perfil.tempoTotal,'#58d7e9'],['MAIOR',perfil.maiorTempo,'#ffbe69'],['MEDIA',mediaPartida,'#b8ff2c']],'TEMPO EM SEGUNDOS');
  if(tipo==='pontuacao')return desenharGraficoBarrasDetalhe([['PONTOS',perfil.maiorPontuacao,'#b8ff2c'],['SEQUENCIA',perfil.melhorSequencia,'#ffbe69']]);
  if(tipo==='sequencia')return desenharGraficoBarrasDetalhe([['ATUAL',sequenciaDiariaAtual(perfil),'#ffb52e'],['RECORDE',Number(perfil.maiorSequenciaDiaria)||0,'#ff6b36']],'DIAS DE JOGO');
  if(tipo==='ultima'){
    const minutos=perfil.ultimaPartida?Math.floor(Math.max(0,Date.now()-new Date(perfil.ultimaPartida).getTime())/60000):0;
    return `${desenharGraficoBarrasDetalhe([['REGISTRO',perfil.ultimaPartida?1:0,'#b8ff2c'],['MINUTOS',minutos,'#58d7e9']],'STATUS DA ULTIMA PARTIDA')}<div class="resumo-detalhe"><p><strong>ULTIMA PARTIDA</strong>${ultimaPartidaFormatada(perfil.ultimaPartida)}</p></div>`;
  }
  return desenharResumoDetalhe(perfil,tipo);
}
abrirDetalheDados=function(tipo){
  if(transicaoDetalheAtiva)return;
  const nome=limpar(e.nome.value)||limpar(jogador),{perfil}=perfilEstatistico(nome);
  if(!perfil){falarDetalheDados(falasPoucosDados);return}
  const titulos={tempo:'TEMPO DE RESPOSTA',acertos:'ACERTOS E ERROS',partidas:'PARTIDAS E DERROTAS',taxas:'TAXAS DE DESEMPENHO',duracao:'TEMPO DE JOGO',ultima:'ULTIMA PARTIDA',pontuacao:'RECORDES DA MISSAO',sequencia:'SEQUENCIA DIARIA'};
  iniciarTransicaoDetalhe('CARREGANDO GRAFICO DETALHADO...',()=>{
    etiquetaDetalheDados.textContent='TERMINAL DE ANALISE DIGITAL';tituloDetalheDados.textContent=titulos[tipo]||'DADOS DETALHADOS';
    if(tipo==='tempo'){
      mensagemDetalheDados.textContent='TEMPO MEDIO PARA RESPONDER CADA TRANSMISSAO, SEPARADO POR DIFICULDADE.';
      conteudoDetalheDados.innerHTML=desenharGraficoTempo(perfil);falarDetalheDados(perfil.tempos.facil.quantidade||perfil.tempos.medio.quantidade||perfil.tempos.dificil.quantidade?falasTempoDados:falasPoucosDados);
    }else{
      mensagemDetalheDados.textContent='GRAFICO GERADO COM DADOS REAIS DESTE NAVEGADOR.';
      conteudoDetalheDados.innerHTML=graficoEspecificoDados(perfil,tipo);falarDetalheDados(falasGraficoDados);
    }
    painelDados.classList.add('detalhe-aberto');detalheDados.hidden=false;voltarDetalheDados.focus();
  });
};

/* Historico local para que todos os dados usem graficos de linhas. */
const carregarEstatisticasComHistoricoDeGraficos=carregarEstatisticas;
carregarEstatisticas=function(){
  const dados=carregarEstatisticasComHistoricoDeGraficos();
  Object.values(dados.perfis).forEach(perfil=>{
    perfil.historicoGraficos=Array.isArray(perfil.historicoGraficos)?perfil.historicoGraficos.filter(item=>item&&typeof item==='object').slice(-30):[];
  });
  return dados;
};
function snapshotGraficoPerfil(perfil){
  const total=(Number(perfil.acertos)||0)+(Number(perfil.erros)||0);
  return {
    momento:Date.now(),partidas:Number(perfil.partidas)||0,derrotas:Number(perfil.derrotas)||0,
    acertos:Number(perfil.acertos)||0,erros:Number(perfil.erros)||0,
    taxaAcerto:total?Math.round((Number(perfil.acertos)||0)/total*100):0,
    taxaErro:total?Math.round((Number(perfil.erros)||0)/total*100):0,
    tempoTotal:Number(perfil.tempoTotal)||0,maiorTempo:Number(perfil.maiorTempo)||0,
    maiorPontuacao:Number(perfil.maiorPontuacao)||0,melhorSequencia:Number(perfil.melhorSequencia)||0,
    sequenciaDiaria:sequenciaDiariaAtual(perfil)
  };
}
function registrarSnapshotGrafico(){
  const nome=limpar(jogador||e.nome.value),{dados,perfil}=perfilEstatistico(nome,true);
  if(!perfil)return;
  const proximo=snapshotGraficoPerfil(perfil),historico=perfil.historicoGraficos||(perfil.historicoGraficos=[]),ultimo=historico.at(-1);
  const campos=['partidas','derrotas','acertos','erros','taxaAcerto','taxaErro','tempoTotal','maiorTempo','maiorPontuacao','melhorSequencia','sequenciaDiaria'];
  if(!ultimo||campos.some(campo=>Number(ultimo[campo])!==proximo[campo]))historico.push(proximo);
  perfil.historicoGraficos=historico.slice(-30);salvarEstatisticas(dados);
}
const atualizarPerfilAtualComHistoricoDeGraficos=atualizarPerfilAtual;
atualizarPerfilAtual=function(acao){const resultado=atualizarPerfilAtualComHistoricoDeGraficos(acao);registrarSnapshotGrafico();return resultado};
const registrarInicioPartidaComHistoricoDeGraficos=registrarInicioPartida;
registrarInicioPartida=function(){const resultado=registrarInicioPartidaComHistoricoDeGraficos();registrarSnapshotGrafico();return resultado};
function desenharGraficoLinhasDados(linhas,unidade){
  const series=linhas.map(([nome,historico,cor])=>[nome,historico.filter(valor=>Number.isFinite(Number(valor))).map(Number),cor]).filter(([,historico])=>historico.length);
  if(!series.length)return '<p class="dados-vazios">JOGUE MAIS PARTIDAS PARA FORMAR O GRAFICO.</p>';
  const maximo=Math.max(1,...series.flatMap(([,historico])=>historico)),largura=380,altura=215,esquerda=46,topo=24,base=166,areaLargura=306,alturaUtil=125;
  const grade=[0,1,2,3,4].map(indice=>{const y=topo+indice*(alturaUtil/4),valor=Math.round(maximo-(maximo/4*indice));return `<line class="grade-grafico" x1="${esquerda}" x2="${esquerda+areaLargura}" y1="${y}" y2="${y}"/><text class="eixo-grafico" x="4" y="${y+3}">${valor}</text>`}).join('');
  const desenhos=series.map(([nome,historico,cor])=>{const pontos=historico.map((valor,indice)=>{const x=esquerda+(historico.length===1?areaLargura/2:indice*areaLargura/(historico.length-1)),y=base-(valor/maximo*alturaUtil);return [x,y,valor]});const linha=pontos.map((ponto,indice)=>`${indice?'L':'M'}${ponto[0].toFixed(1)},${ponto[1].toFixed(1)}`).join('');const area=`M${pontos[0][0]},${base} ${pontos.map(ponto=>`L${ponto[0]},${ponto[1]}`).join(' ')} L${pontos.at(-1)[0]},${base} Z`;const ultimo=pontos.at(-1);return `<path d="${area}" fill="${cor}1c"/><path d="${linha}" fill="none" stroke="${cor}" stroke-width="2.4"/>${pontos.map(ponto=>`<circle cx="${ponto[0]}" cy="${ponto[1]}" r="3.4" fill="${cor}"/>`).join('')}<text class="rotulo-ponto-grafico" x="${ultimo[0]+5}" y="${Math.max(13,ultimo[1]-6)}" fill="${cor}">${ultimo[2]}</text>`}).join('');
  return `<p class="ajuda-grafico">${unidade} · CADA PONTO REPRESENTA UMA ATUALIZACAO REAL</p><div class="legenda-grafico">${series.map(([nome,historico,cor])=>`<span><i style="--cor:${cor}"></i>${nome}: ${historico.at(-1)}</span>`).join('')}</div><svg class="grafico-linhas" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="Grafico historico de dados">${grade}<line class="grade-grafico" x1="${esquerda}" x2="${esquerda+areaLargura}" y1="${base}" y2="${base}"/><text class="eixo-grafico" x="${esquerda}" y="190">ATUALIZACOES MAIS RECENTES</text>${desenhos}</svg>`;
}
Object.assign(chaveDetalhePorRotulo,{'TAXA DE ACERTO':'taxas','TAXA DE ERRO':'taxas','TEMPO TOTAL':'duracao','MAIOR TEMPO':'duracao','MELHOR SEQUENCIA':'melhorSequencia'});
graficoEspecificoDados=function(perfil,tipo){
  const historico=perfil.historicoGraficos?.length?perfil.historicoGraficos:[snapshotGraficoPerfil(perfil)];
  const linha=(nome,campo,cor)=>[nome,historico.map(item=>Number(item[campo])||0),cor];
  if(tipo==='partidas')return desenharGraficoLinhasDados([linha('PARTIDAS','partidas','#b8ff2c'),linha('DERROTAS','derrotas','#ff8b63')],'PARTIDAS');
  if(tipo==='acertos')return desenharGraficoLinhasDados([linha('ACERTOS','acertos','#b8ff2c'),linha('ERROS','erros','#ff5d55')],'RESPOSTAS');
  if(tipo==='taxas')return desenharGraficoLinhasDados([linha('ACERTO %','taxaAcerto','#b8ff2c'),linha('ERRO %','taxaErro','#ff5d55')],'PORCENTAGEM');
  if(tipo==='duracao')return desenharGraficoLinhasDados([linha('TEMPO TOTAL','tempoTotal','#58d7e9'),linha('MAIOR TEMPO','maiorTempo','#ffbe69')],'TEMPO EM SEGUNDOS');
  if(tipo==='pontuacao')return desenharGraficoLinhasDados([linha('PONTUACAO','maiorPontuacao','#b8ff2c')],'PONTOS');
  if(tipo==='melhorSequencia')return desenharGraficoLinhasDados([linha('SEQUENCIA','melhorSequencia','#ffbe69')],'ACERTOS CONSECUTIVOS');
  if(tipo==='sequencia')return desenharGraficoLinhasDados([linha('SEQUENCIA DIARIA','sequenciaDiaria','#ffb52e')],'DIAS CONSECUTIVOS');
  if(tipo==='ultima')return desenharGraficoLinhasDados([linha('PARTIDAS','partidas','#b8ff2c')],'REGISTROS DE PARTIDA');
  return desenharResumoDetalhe(perfil,tipo);
};

/* Modo especial teste1: uma sequencia didatica fixa de dez decodificacoes. */
const sequenciaTeste1=['a','b','c','jogo','paz','robo','familia','banana','binario','codigo'];
const dicasTeste1={
  a:'E a primeira letra do alfabeto.',b:'E a segunda letra do alfabeto.',c:'E a terceira letra do alfabeto.',
  jogo:'E uma atividade feita para se divertir ou competir.',paz:'E o oposto de guerra e representa harmonia.',
  robo:'E uma maquina que pode executar tarefas programadas.',familia:'E formada por pessoas que possuem vinculos de parentesco ou cuidado.',
  banana:'E uma fruta amarela, comprida e muito comum.',binario:'E um sistema que usa apenas zero e um.',
  codigo:'E um conjunto de simbolos ou regras usado para representar uma informacao.'
};
Object.assign(dicasContextuais,dicasTeste1);
let modoTeste1Ativo=false,indiceTeste1=0,modoTeste1Concluido=false;
const indicadorTeste1=document.createElement('div');
indicadorTeste1.id='indicadorTeste1';indicadorTeste1.hidden=true;indicadorTeste1.setAttribute('aria-live','polite');
e.codigo.parentElement.before(indicadorTeste1);
function estaNoModoTeste1(){return limpar(e.nome.value||jogador)==='teste1'}
function nivelModoTeste1(){return indiceTeste1<3?'facil':indiceTeste1<6?'medio':'dificil'}
function atualizarIndicadorModoTeste1(concluido=false){
  indicadorTeste1.hidden=!modoTeste1Ativo;
  if(!modoTeste1Ativo)return;
  const atualTeste=Math.min(indiceTeste1+1,sequenciaTeste1.length);
  const marcadores=sequenciaTeste1.map((_,indice)=>`<i class="${indice<indiceTeste1||concluido?'concluido':indice===indiceTeste1&&!concluido?'atual':''}" aria-hidden="true"></i>`).join('');
  indicadorTeste1.innerHTML=`<span>MODO DE TESTE // DECODIFICACAO ${concluido?'10 DE 10':`${atualTeste} DE 10`}</span><b>${marcadores}</b>`;
}
function concluirModoTeste1(){
  if(modoTeste1Concluido)return;
  modoTeste1Concluido=true;partidaEncerrada=true;atualizarIndicadorModoTeste1(true);
  e.feedback.className='acerto';e.feedback.textContent='MISSÃO DE TESTE CONCLUÍDA! Você decifrou as 10 transmissões.';
  expressaoBino('orgulhoso');falar('Missao de teste concluida! Voce decifrou todas as dez transmissoes.');
  e.modalC.classList.add('sucesso-teste1');
  e.modalC.innerHTML='<div class="sucesso-ruido" aria-hidden="true"><i>01000011 01001111 01000100 01001001 01000111 01001111</i><i>00110001 00110000 00110001 00110000</i></div><p class="sucesso-terminal">TERMINAL B.I.N.O. // MISSAO CONCLUIDA</p><div class="sucesso-bino" aria-hidden="true"><span></span><span></span><b></b><i></i></div><h2 id="tituloModal">MISSÃO DE TESTE CONCLUÍDA</h2><p class="sucesso-status">SINAL ESTAVEL // 10 DE 10 TRANSMISSOES DECIFRADAS</p><div class="sucesso-dados"><span>CODIGOS PROCESSADOS <b>10</b></span><span>PONTUACAO FINAL <b>'+pontos+'</b></span><span>STATUS <b>COMPLETO</b></span></div><p>Você concluiu as dez decodificações na ordem correta. Meus sensores registraram uma missão exemplar.</p><div class="acoes-modal"><button id="reiniciarTeste1" type="button">JOGAR NOVAMENTE</button><button id="menuTeste1" class="botao-secundario" type="button">VOLTAR AO MENU</button></div>';
  abrirModal();
  $('reiniciarTeste1').onclick=()=>{fecharModal();partidaEncerrada=false;iniciarJogo()};
  $('menuTeste1').onclick=()=>{fecharModal();partidaEncerrada=false;mostrarMenu()};
}
function gerarPuzzleModoTeste1(){
  if(indiceTeste1>=sequenciaTeste1.length){concluirModoTeste1();return}
  atual=sequenciaTeste1[indiceTeste1];ultimo=atual;perguntasDaPartida++;dicas=0;posicoesReveladas=new Set();
  mostrarCodigoGradual(binario(atual));e.resp.value='';e.nivel.textContent=nivelModoTeste1().toUpperCase();
  e.feedback.className='';e.feedback.textContent='Decifre a mensagem usando o alfabeto abaixo.';atualizarIndicadorModoTeste1();
  registrarInicioPerguntaDados();animarLetrasReveladas();sinalizarTuring('recebendo');atualizarNivelTuring();receberDadosTuring();
  if(sequencia&&sequencia%5===0&&!missao)liberarTransmissaoOculta();
  e.resp.focus();
}
const iniciarJogoComModoTeste1=iniciarJogo;
iniciarJogo=function(){modoTeste1Ativo=estaNoModoTeste1();indiceTeste1=0;modoTeste1Concluido=false;indicadorTeste1.hidden=!modoTeste1Ativo;return iniciarJogoComModoTeste1()};
const gerarPuzzleComModoTeste1=gerarPuzzleAleatorio;
gerarPuzzleAleatorio=function(){return modoTeste1Ativo?gerarPuzzleModoTeste1():gerarPuzzleComModoTeste1()};
const verificarRespostaComModoTeste1=verificarResposta;
verificarResposta=function(){
  const acertou=modoTeste1Ativo&&!partidaEncerrada&&limpar(e.resp.value)===atual;
  const resultado=verificarRespostaComModoTeste1();
  if(acertou)indiceTeste1++;
  return resultado;
};
document.getElementById('botaoPular')?.addEventListener('click',()=>{
  if(modoTeste1Ativo&&!partidaEncerrada&&pontos>=125)indiceTeste1++;
},true);
const fecharModalComVisualTeste1=fecharModal;
fecharModal=function(){e.modalC.classList.remove('sucesso-teste1');return fecharModalComVisualTeste1()};
e.fechar.addEventListener('click',()=>e.modalC.classList.remove('sucesso-teste1'));
