const fases = [
  {codigo:'01000001', resposta:'A', tipo:'letra', dica:'É a primeira letra do alfabeto.'},
  {codigo:'01000010', resposta:'B', tipo:'letra', dica:'Vem logo depois da letra A.'},
  {codigo:'01000011', resposta:'C', tipo:'letra', dica:'É a terceira letra do alfabeto.'},
  {codigo:'01001111 01001001', resposta:'OI', tipo:'palavra', dica:'Uma saudação curta e amigável.'},
  {codigo:'01010000 01000001 01011010', resposta:'PAZ', tipo:'palavra', dica:'Uma palavra que representa harmonia.'},
  {codigo:'01000011 11000011 10010011 01000100 01001001 01000111 01001111', resposta:'CÓDIGO', tipo:'palavra', dica:'É o que você está decifrando agora.'},
  {codigo:'01001101 01010101 01001110 01000100 01001111 00100000 01000100 01001001 01000111 01001001 01010100 01000001 01001100', resposta:'MUNDO DIGITAL', tipo:'frase', dica:'Um lugar onde informação vira linguagem.'},
  {codigo:'01000001 01010000 01010010 01000101 01001110 01000100 01000101 01010010 00100000 01000101 00100000 01000001 01010010 01010010 01000001 01010011 01000001 01010010', resposta:'APRENDER É ARRASAR', tipo:'frase', dica:'Uma mensagem especial para quem chegou até aqui!'}
];

const $ = id => document.getElementById(id);
const elementos = {codigo:$('codigoBinario'), resposta:$('resposta'), formulario:$('formResposta'), dica:$('botaoDica'), feedback:$('feedback'), fala:$('falaRobo'), robo:$('robo'), pontos:$('pontos'), fase:$('faseTopo'), nivel:$('nivelTexto'), instrucao:$('instrucao'), progresso:$('progresso'), lista:$('listaDescobertas'), contador:$('contadorBanco'), flash:$('flashSucesso'), sinal:$('botaoSinal'), resultadoSinal:$('resultadoSinal'), aviso:$('avisoFase'), volume:$('volumeGeral'), valorVolume:$('valorVolume'), musica:$('botaoMusica'), efeitos:$('botaoEfeitos'), voz:$('botaoVoz'), reiniciar:$('botaoReiniciar'), estadoAudio:$('estadoAudio')};
let faseAtual = 0, pontos = 0, dicasUsadas = 0;

const configuracaoPadrao = {volume:.55, musica:false, efeitos:true, voz:true};
let configuracao = {...configuracaoPadrao, ...JSON.parse(sessionStorage.getItem('binoAudio') || '{}')};
let contextoAudio, ganhoMestre, musicaAmbiente, ultimoToque = 0;

function prepararAudio(){
  if(!contextoAudio){contextoAudio=new (window.AudioContext||window.webkitAudioContext)();ganhoMestre=contextoAudio.createGain();ganhoMestre.gain.value=configuracao.volume;ganhoMestre.connect(contextoAudio.destination);}
  if(contextoAudio.state==='suspended') contextoAudio.resume();
}
function salvarAudio(){sessionStorage.setItem('binoAudio',JSON.stringify(configuracao));}
function tom(frequencia,duracao=.09,tipo='sine',volume=.12,atraso=0){
  if(!configuracao.efeitos || !contextoAudio) return;
  const oscilador=contextoAudio.createOscillator(), ganho=contextoAudio.createGain(), inicio=contextoAudio.currentTime+atraso;
  oscilador.type=tipo;oscilador.frequency.setValueAtTime(frequencia,inicio);ganho.gain.setValueAtTime(.001,inicio);ganho.gain.exponentialRampToValueAtTime(volume,inicio+.012);ganho.gain.exponentialRampToValueAtTime(.001,inicio+duracao);oscilador.connect(ganho).connect(ganhoMestre);oscilador.start(inicio);oscilador.stop(inicio+duracao+.03);
}
function somClique(suave=false){prepararAudio();tom(suave?720:540,suave?.035:.06,'square',suave?.025:.06);}
function somDica(){prepararAudio();tom(480,.08,'sine',.07);tom(660,.12,'sine',.06,.09);}
function somErro(){prepararAudio();tom(210,.12,'triangle',.09);tom(165,.16,'sine',.06,.1);}
function somDescoberta(){prepararAudio();[440,660,880].forEach((nota,i)=>tom(nota,.12,'sine',.08,i*.09));}
function somAcerto(){prepararAudio();tom(520,.08,'square',.06);tom(740,.15,'sine',.09,.08);tom(1040,.25,'triangle',.12,.2);}
function somFase(){prepararAudio();[392,523,659,784].forEach((nota,i)=>tom(nota,.16,'sine',.075,i*.1));}
function somSinalMisterioso(){prepararAudio();[270,350,310,440].forEach((nota,i)=>tom(nota,.07,'square',.045,i*.12));}
function somBino(tipo='fala'){prepararAudio();const sons={fala:[620,.045],dica:[740,.06],comemorar:[840,.08],erro:[300,.06],surpresa:[980,.07],piscar:[1050,.025]};const [nota,duracao]=sons[tipo]||sons.fala;tom(nota,duracao,'sine',.04);}
function iniciarMusica(){
  prepararAudio();if(musicaAmbiente) return;
  const ganho=contextoAudio.createGain(), oscilador=contextoAudio.createOscillator(), oscilador2=contextoAudio.createOscillator();ganho.gain.value=.018;oscilador.type='sine';oscilador.frequency.value=110;oscilador2.type='triangle';oscilador2.frequency.value=165;oscilador2.detune.value=5;oscilador.connect(ganho);oscilador2.connect(ganho);ganho.connect(ganhoMestre);oscilador.start();oscilador2.start();musicaAmbiente={oscilador,oscilador2,ganho};
}
function pararMusica(){if(!musicaAmbiente)return;musicaAmbiente.oscilador.stop();musicaAmbiente.oscilador2.stop();musicaAmbiente=null;}
function vozBinaria(texto){return texto.replace(/([01]{8}(?:\s+[01]{8})*)/g,sequencia=>sequencia.split(' ').map(grupo=>grupo.split('').map(bit=>bit==='0'?'zero':'um').join(', ')).join('... '));}
function falar(texto,tipo='fala'){
  elementos.fala.textContent=texto;somBino(tipo);
  if(!configuracao.voz || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();const fala=new SpeechSynthesisUtterance(vozBinaria(texto));fala.lang='pt-BR';fala.rate=.86;fala.pitch=1.18;fala.volume=Math.min(.8,configuracao.volume);speechSynthesis.speak(fala);
}
function atualizarPainelAudio(){elementos.volume.value=Math.round(configuracao.volume*100);elementos.valorVolume.textContent=`${Math.round(configuracao.volume*100)}%`;const rotulos={musica:['MÚSICA: LIGADA','MÚSICA: DESLIGADA'],efeitos:['EFEITOS: LIGADOS','EFEITOS: DESLIGADOS'],voz:['VOZ B.I.N.O.: LIGADA','VOZ B.I.N.O.: DESLIGADA']};Object.entries(rotulos).forEach(([chave,texto])=>{const botao=elementos[chave];botao.textContent=texto[configuracao[chave]?0:1];botao.setAttribute('aria-pressed',configuracao[chave]);});elementos.estadoAudio.textContent=configuracao.efeitos?'ATIVO':'SILENCIOSO';}
function normalizar(valor){return valor.trim().toLocaleUpperCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function montarProgresso(){elementos.progresso.innerHTML=fases.map((_,i)=>`<span class="etapa ${i<faseAtual?'concluida':i===faseAtual?'ativa':''}"></span>`).join('');}
function carregarFase(){const fase=fases[faseAtual];elementos.codigo.textContent=fase.codigo;elementos.resposta.value='';elementos.resposta.maxLength=fase.resposta.length+8;elementos.resposta.className='';elementos.fase.textContent=String(faseAtual+1).padStart(2,'0');elementos.nivel.textContent=fase.tipo.toUpperCase();elementos.instrucao.textContent=`Decifre ${fase.tipo==='letra'?'a letra':fase.tipo==='palavra'?'a palavra':'a frase'} escondida nos grupos de oito bits.`;elementos.feedback.className='';elementos.feedback.textContent='Aguardando sua resposta...';dicasUsadas=0;montarProgresso();falar(`Minha combinação é: ${fase.codigo}. Consegue decifrar?`);elementos.resposta.focus();}
function registrarDescoberta(fase){const vazio=elementos.lista.querySelector('.vazio');if(vazio)vazio.remove();const item=document.createElement('div');item.className='descoberta';item.innerHTML=`<code>${fase.codigo}</code> → <strong>${fase.resposta}</strong>`;elementos.lista.appendChild(item);elementos.contador.textContent=`${faseAtual+1} CÓDIGO${faseAtual?'S':''}`;document.body.classList.remove('brilho-descoberta');void document.body.offsetWidth;document.body.classList.add('brilho-descoberta');somDescoberta();}
function reagir(classe){elementos.robo.classList.remove('comemorando','triste');void elementos.robo.offsetWidth;elementos.robo.classList.add(classe);}
function mostrarFase(){elementos.aviso.classList.remove('mostrar');void elementos.aviso.offsetWidth;elementos.aviso.classList.add('mostrar');}
function acertar(){const fase=fases[faseAtual],ganho=dicasUsadas?70:100;pontos+=ganho;elementos.pontos.textContent=String(pontos).padStart(3,'0');elementos.resposta.classList.add('correto');elementos.feedback.className='acerto';elementos.feedback.textContent=`Decodificação correta! +${ganho} pontos`;somAcerto();registrarDescoberta(fase);reagir('comemorando');falar(`Código decifrado! ${fase.resposta} estava escondido na transmissão.`, 'comemorar');elementos.flash.classList.remove('mostrar');void elementos.flash.offsetWidth;elementos.flash.classList.add('mostrar');faseAtual++;montarProgresso();if(faseAtual===fases.length){setTimeout(finalizar,1500)}else{somFase();mostrarFase();setTimeout(carregarFase,1400)}}
function errar(){somErro();elementos.resposta.classList.add('incorreto');elementos.feedback.className='erro';elementos.feedback.textContent='Ainda não é essa resposta. Tente mais uma vez!';reagir('triste');falar('Hmm... quase. Tente novamente.', 'erro');setTimeout(()=>elementos.resposta.classList.remove('incorreto'),500)}
function finalizar(){elementos.codigo.textContent='01001101 01001001 01010011 01010011 11000011 10000011 01001111 00100000 01000011 01001101 01010000 01001100 01000101 01010100 01000001';elementos.instrucao.textContent='Missão concluída! Você aprendeu que bits podem formar mensagens incríveis.';elementos.formulario.style.display='none';elementos.dica.style.display='none';elementos.feedback.className='acerto';elementos.feedback.textContent='Você completou todas as fases!';elementos.nivel.textContent='MESTRE';falar('Missão cumprida! Você é oficialmente um mestre decodificador binário!', 'comemorar');}
function reiniciarJogo(){somClique();faseAtual=0;pontos=0;dicasUsadas=0;elementos.pontos.textContent='000';elementos.lista.innerHTML='<p class="vazio">Suas descobertas aparecerão aqui.</p>';elementos.contador.textContent='0 CÓDIGOS';elementos.formulario.style.display='block';elementos.dica.style.display='inline-block';elementos.sinal.disabled=false;elementos.resultadoSinal.textContent='';carregarFase();falar('Sistema reiniciado. Uma nova missão está pronta!', 'surpresa');}

elementos.formulario.addEventListener('submit',e=>{e.preventDefault();somClique();if(!elementos.resposta.value.trim())return;normalizar(elementos.resposta.value)===normalizar(fases[faseAtual].resposta)?acertar():errar();});
elementos.dica.addEventListener('click',()=>{somDica();const fase=fases[faseAtual];dicasUsadas++;falar(`Dica do B.I.N.O.: ${fase.dica}`,'dica');elementos.feedback.className='';elementos.feedback.textContent='Dica enviada pelo B.I.N.O.!';});
elementos.sinal.addEventListener('click',()=>{somSinalMisterioso();document.querySelector('.sinal').classList.add('sinal-ativo');setTimeout(()=>document.querySelector('.sinal').classList.remove('sinal-ativo'),1800);elementos.resultadoSinal.textContent='Sinal decifrado: 3F4 — uma referência secreta ao nível extra do B.I.N.O.!';falar('Sinal resolvido! Descoberta tecnológica registrada.', 'surpresa');somDescoberta();elementos.sinal.disabled=true;});
elementos.volume.addEventListener('input',()=>{configuracao.volume=elementos.volume.value/100;if(ganhoMestre)ganhoMestre.gain.value=configuracao.volume;atualizarPainelAudio();salvarAudio();});
elementos.musica.addEventListener('click',()=>{somClique();configuracao.musica=!configuracao.musica;configuracao.musica?iniciarMusica():pararMusica();atualizarPainelAudio();salvarAudio();});
elementos.efeitos.addEventListener('click',()=>{prepararAudio();configuracao.efeitos=!configuracao.efeitos;if(configuracao.efeitos)somClique();atualizarPainelAudio();salvarAudio();});
elementos.voz.addEventListener('click',()=>{somClique();configuracao.voz=!configuracao.voz;if(!configuracao.voz&&'speechSynthesis'in window)speechSynthesis.cancel();atualizarPainelAudio();salvarAudio();});
elementos.reiniciar.addEventListener('click',reiniciarJogo);
document.querySelectorAll('button').forEach(botao=>botao.addEventListener('pointerenter',()=>{const agora=Date.now();if(agora-ultimoToque>140){somClique(true);ultimoToque=agora;}}));
atualizarPainelAudio();carregarFase();
