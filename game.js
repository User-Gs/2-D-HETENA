/* Hetena Tatakai: browser prototype. No build step, network requests or external assets. */
const fighters = [
  {name:'Leyla',country:'Türkiye',style:'Kickboks · Muay Thai',hp:24,power:3,defense:3,speed:3,colors:['#167d89','#48b9be','#ad704b','#39251f'],special:'Kurt Adımı'},
  {name:'Eleni',country:'Yunanistan',style:'Çevik dövüş',hp:22,power:3,defense:2,speed:4,colors:['#1ba9b8','#f1c74d','#cf9d79','#493321'],special:'Ege Hamlesi'},
  {name:'Anna',country:'Almanya',style:'Boks',hp:26,power:4,defense:3,speed:2,colors:['#262b32','#e4b450','#e0ae8c','#d0ad60'],special:'Kartal Yumruğu'},
  {name:'Katarina',country:'Rusya',style:'Karate',hp:22,power:3,defense:2,speed:4,colors:['#4b486b','#b9a2db','#ebc0a2','#d9c99d'],special:'Buz Kıran'},
  {name:'Jessica',country:'ABD',style:'Boks · Kickboks',hp:23,power:3,defense:2,speed:4,colors:['#2a5fca','#6eb7f4','#dfab8e','#2366df'],special:'Mavi Fırtına'},
  {name:'Ayaka',country:'Japonya',style:'Karate · Aikido',hp:22,power:2,defense:2,speed:4,colors:['#8f353e','#df7d85','#e5b899','#252734'],special:'Dojo Ritmi'},
  {name:'Poly',country:'Birleşik Krallık',style:'Sokak dövüşü',hp:23,power:3,defense:2,speed:3,colors:['#a3334e','#ef7185','#d1a07e','#19202f'],special:'Punk Patlaması'},
  {name:'Hélène',country:'Fransa',style:'Judo · Capoeira',hp:24,power:3,defense:3,speed:3,colors:['#657798','#b5c4d4','#e8bca3','#76533b'],special:'Asil Karşılık'},
  {name:'Mei',country:'Çin',style:'Sokak dövüşü',hp:22,power:3,defense:2,speed:4,colors:['#922b43','#de6974','#c99474','#202127'],special:'Kowloon Baskını'},
  {name:'Dao',country:'Tayland',style:'Muay Thai',hp:25,power:4,defense:3,speed:2,colors:['#af7233','#e8b85e','#c9936d','#2a2623'],special:'Borana Dönüşü'},
  {name:'Nefarati',country:'Mısır',style:'Tahtib',hp:22,power:2,defense:2,speed:3,colors:['#7d6441','#e5c977','#c99470','#191919'],special:'Kum Aldatmacası'},
  {name:'Morana',country:'Sırbistan',style:'Sezgisel dövüş',hp:23,power:3,defense:2,speed:3,colors:['#5c426c','#b686bb','#ddae9c','#302332'],special:'Karanlık Zar'}
];
const $ = id => document.getElementById(id);
const state={mode:'quick',selected:0,opponent:1,arena:'temple',stance:'aggressive',move:'punch',round:1,phase:'home',busy:false,sound:true,streak:0,usedMorana:false,player:null,enemy:null,energy:100};
const labels={punch:'Düz yumruk',kick:'Yüksek tekme',guard:'Savunma',taunt:'Kışkırtma',special:'Özel hamle'};
const arenas={temple:'YAĞMURLU TAPINAK',city:'GECE ŞEHRİ',coast:'KIYI ARENASI'};
let audioContext;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const rand=n=>{if(globalThis.crypto?.getRandomValues){const buf=new Uint32Array(1);crypto.getRandomValues(buf);return buf[0]%n}return Math.floor(Math.random()*n)};
const roll=()=>rand(6)+1;
function tone(freq=330,duration=.11,type='triangle'){
 if(!state.sound)return;
 try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(freq,audioContext.currentTime);oscillator.frequency.exponentialRampToValueAtTime(Math.max(90,freq*.58),audioContext.currentTime+duration);gain.gain.setValueAtTime(.08,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);oscillator.connect(gain).connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+duration)}catch{}
}
function show(id){for(const node of document.querySelectorAll('.screen'))node.classList.toggle('hidden',node.id!==id);state.phase=id;window.scrollTo({top:0,behavior:'instant'})}
function colorStyle(f){return `--tone:${f.colors[0]};--light:${f.colors[1]};--skin:${f.colors[2]};--hair:${f.colors[3]}`}
function fillRoster(){
 $('fighterCount').textContent=`${fighters.length} DÖVÜŞÇÜ`;
 $('roster').innerHTML=fighters.map((f,i)=>`<button class="fighter-card ${i===state.selected?'active':''}" data-fighter="${i}" style="${colorStyle(f)}"><span class="avatar">${f.name.slice(0,1)}</span><strong>${f.name}</strong><small>${f.country} · ${f.style}</small></button>`).join('');
 $('opponentSelect').innerHTML=fighters.map((f,i)=>`<option value="${i}">${f.name}</option>`).join('');
 if(state.mode==='quick'&&state.opponent===state.selected)state.opponent=(state.selected+1)%fighters.length;
 $('opponentSelect').value=String(state.opponent);$('opponentSelect').disabled=state.mode==='tournament';
 const f=fighters[state.selected];$('selectedCard').style.cssText=colorStyle(f);$('selectedCard').innerHTML=`<span>${f.country.toUpperCase()} · ${f.style.toUpperCase()}</span><strong>${f.name}</strong><p>CAN ${f.hp} · GÜÇ ${f.power} · SAVUNMA ${f.defense} · HIZ ${f.speed}</p><p>Özel hamle: ${f.special}</p>`;
 $('modeCaption').textContent=state.mode==='tournament'?`Turnuva: ${state.streak}/3 galibiyet. Rakip otomatik seçilir.`:'Hızlı maç için iki dövüşçü seç.';
}
function openSelect(mode){state.mode=mode;if(mode==='tournament'){state.streak=0;pickOpponent()}fillRoster();show('select')}
function pickOpponent(){const choices=fighters.map((_,i)=>i).filter(i=>i!==state.selected);state.opponent=choices[rand(choices.length)]}
function setSelected(index){state.selected=index;if(state.mode==='tournament')pickOpponent();fillRoster()}
function updateHud(){
 for(const [f,bar,trail,text] of [[state.player,$('playerHealth'),$('playerDamage'),$('playerHpText')],[state.enemy,$('enemyHealth'),$('enemyDamage'),$('enemyHpText')]]){const percent=Math.max(0,f.hp/f.max*100);bar.style.width=`${percent}%`;setTimeout(()=>trail.style.width=`${percent}%`,90);text.textContent=`${f.hp} / ${f.max}`}
 $('playerMood').textContent=`ENERJİ ${state.energy}%`;$('enemyMood').textContent=`MORAL ${state.enemy.morale}%`;$('roundNumber').textContent=String(state.round).padStart(2,'0');
 const cooldown=Math.max(0,(state.player.lastSpecial??-4)+3-state.round+1);$('specialBtn').disabled=cooldown>0||state.energy<25;$('specialLabel').textContent=cooldown>0?`${cooldown} raunt bekle`:state.energy<25?'25 enerji gerekli':`${state.player.data.special} · 25 enerji`;
}
function startFight(){
 if(state.selected===state.opponent){modal('RAKİP SEÇ','Farklı bir dövüşçü seç.','Bir dövüşçü kendisiyle maça çıkamaz.',[{label:'Tamam',fn:closeModal}]);return}
 state.arena=$('arenaSelect').value;state.player={data:fighters[state.selected],hp:fighters[state.selected].hp,max:fighters[state.selected].hp,morale:100,lastSpecial:-4,hits:0,tauntsIgnored:0};state.enemy={data:fighters[state.opponent],hp:fighters[state.opponent].hp,max:fighters[state.opponent].hp,morale:100,lastSpecial:-4,hits:0,tauntsIgnored:0};state.round=1;state.energy=100;state.busy=false;state.usedMorana=false;state.move='punch';
 $('arena').className=`arena ${state.arena}`;$('arenaName').textContent=arenas[state.arena];$('playerName').textContent=state.player.data.name.toUpperCase();$('enemyName').textContent=state.enemy.data.name.toUpperCase();$('fighterPlayer').style.cssText=colorStyle(state.player.data);$('fighterEnemy').style.cssText=colorStyle(state.enemy.data);$('playerPortrait').style.cssText=colorStyle(state.player.data);$('enemyPortrait').style.cssText=colorStyle(state.enemy.data);$('playerPortrait').textContent=state.player.data.name[0];$('enemyPortrait').textContent=state.enemy.data.name[0];$('fighterPlayer').classList.remove('ko');$('fighterEnemy').classList.remove('ko');$('diceFace').textContent='—';$('combatText').textContent=state.stance==='aggressive'?'Agresif cevap: ilk zarına +1. Hamleni seç.':'Sakin cevap: hamleni seç.';$('rollBtn').disabled=false;chooseMove('punch');updateHud();show('battle');tone(520,.15)
}
function chooseMove(move){if(state.busy)return;state.move=move;document.querySelectorAll('.move').forEach(b=>b.classList.toggle('active',b.dataset.move===move));$('turnTip').textContent=`Seçili hamle: ${labels[move]}`}
function flash(actor,target,n){actor.classList.add('attack');target.classList.add('hurt');$('impact').textContent=n>0?`−${n}`:'ISKA';$('impact').classList.remove('pop');void $('impact').offsetWidth;$('impact').classList.add('pop');tone(n>0?220:460,n>0?.18:.08,'sawtooth');setTimeout(()=>{actor.classList.remove('attack');target.classList.remove('hurt')},450)}
function deal(attacker,defender,move,die,defending=false){
 if(move==='guard')return{damage:0,message:'Savunmada bekledi.'};
 if(move==='taunt'){defender.morale=Math.max(30,defender.morale-12);return{damage:0,message:'Rakibin morali düştü.'}}
 if(move==='kick'&&die<=2)return{damage:0,message:'Tekme boşa çıktı.'};
 let damage=Math.max(1,die+attacker.data.power-defender.data.defense-2);
 if(move==='kick')damage+=2;
 if(move==='special')damage+=3;
 if(attacker===state.player&&state.round===1&&state.stance==='aggressive')damage+=1;
 if(attacker.data.name==='Katarina'&&attacker.hp<=Math.ceil(attacker.max*.1))damage+=1;
 if(attacker.data.name==='Dao'&&state.round>=5&&attacker.morale===100)damage+=1;
 if(attacker.data.name==='Morana'&&die===1&&!state.usedMorana&&attacker===state.player){damage+=1+rand(3)+1;state.usedMorana=true}
 if(defending)damage=Math.max(0,damage-3);
 defender.hp=Math.max(0,defender.hp-damage);defender.hits++;
 return{damage,message:`${labels[move]} ${damage} hasar verdi.`};
}
function botMove(){if(state.enemy.hp<state.enemy.max*.32&&rand(4)===0)return'guard';if(state.enemy.morale<65&&rand(4)===0)return'taunt';const picks=['punch','punch','kick','kick','guard'];return picks[rand(picks.length)]}
function applyGuard(who){who.hp=Math.min(who.max,who.hp+1)}
async function playTurn(){
 if(state.busy||state.phase!=='battle')return;
 if(state.move==='special'&&$('specialBtn').disabled)return;
 state.busy=true;$('rollBtn').disabled=true;
 const myMove=state.move,enemyMove=botMove(),myDie=roll(),enemyDie=roll();$('diceFace').textContent='⚄';$('combatText').textContent='Zarlar dönüyor…';tone(640,.09);await wait(360);$('diceFace').textContent=String(myDie);await wait(180);
 if(myMove==='guard')applyGuard(state.player);
 if(myMove==='special'){state.energy=Math.max(0,state.energy-25);state.player.lastSpecial=state.round}else state.energy=Math.min(100,state.energy+8);
 let first=deal(state.player,state.enemy,myMove,myDie,myMove==='guard');
 if(myMove==='taunt'&&state.enemy.data.name==='Poly')state.enemy.morale=Math.min(100,state.enemy.morale+15);
 if(myMove==='taunt'&&state.enemy.data.name==='Leyla')state.enemy.tauntsIgnored++;
 if(state.enemy.data.name==='Leyla'&&state.enemy.tauntsIgnored===4){state.enemy.hp=Math.min(state.enemy.max,state.enemy.hp+3);state.enemy.tauntsIgnored++}
 if(first.damage)flash($('fighterPlayer'),$('fighterEnemy'),first.damage);
 $('combatText').textContent=`${state.player.data.name}: ${first.message}`;updateHud();await wait(700);
 if(state.enemy.hp<=0){finish('win');return}
 if(enemyMove==='guard')applyGuard(state.enemy);
 const second=deal(state.enemy,state.player,enemyMove,enemyDie,enemyMove==='guard');
 if(enemyMove==='taunt'&&state.player.data.name==='Leyla')state.player.tauntsIgnored++;
 if(state.player.data.name==='Leyla'&&state.player.tauntsIgnored===4){state.player.hp=Math.min(state.player.max,state.player.hp+3);state.energy=Math.min(100,state.energy+20);state.player.tauntsIgnored++}
 if(state.player.data.name==='Jessica'&&!state.player.healed&&state.player.hp<=state.player.max*.5&&state.enemy.hp>=state.enemy.max*.8){state.player.hp=Math.min(state.player.max,state.player.hp+3);state.player.healed=true}
 if(second.damage)flash($('fighterEnemy'),$('fighterPlayer'),second.damage);
 $('combatText').textContent=`${state.enemy.data.name}: ${second.message}`;updateHud();await wait(650);
 if(state.player.hp<=0){finish('lose');return}
 state.round++;updateHud();$('combatText').textContent=`Raunt ${state.round}: sıradaki hamleni seç.`;$('rollBtn').disabled=false;state.busy=false;
}
function finish(result){state.busy=false;$('rollBtn').disabled=true;if(result==='win'){$('fighterEnemy').classList.add('ko');if(state.mode==='tournament')state.streak++}else $('fighterPlayer').classList.add('ko');tone(result==='win'?700:150,.45);
 const champ=state.mode==='tournament'&&state.streak>=3;
 let actions=[];if(state.mode==='tournament'&&result==='win'&&!champ)actions=[{label:'Sonraki rakip →',fn:()=>{closeModal();pickOpponent();fillRoster();show('select')}},{label:'Ana menü',fn:goHome}];else actions=[{label:'Tekrar oyna',fn:()=>{closeModal();if(state.mode==='tournament')state.streak=0;startFight()}},{label:'Karakter seç',fn:()=>{closeModal();fillRoster();show('select')}},{label:'Ana menü',fn:goHome}];
 const heading=champ?'TURNUVA ŞAMPİYONU':result==='win'?'GALİBİYET':'MAĞLUBİYET';const message=champ?'Üç rakibi de yendin. Kupa senin!':result==='win'?`${state.enemy.data.name} yenildi. ${state.round}. rauntta galip geldin.`:`${state.player.data.name} yenildi. Yeni bir stratejiyle tekrar dene.`;
 modal(state.mode==='tournament'?`TURNUVA · ${state.streak}/3 GALİBİYET`:'MAÇ SONUCU',heading,message,actions);
}
function modal(eyebrow,title,body,actions){$('modalEyebrow').textContent=eyebrow;$('modalTitle').textContent=title;$('modalBody').textContent=body;$('modalActions').replaceChildren();for(const action of actions){const button=document.createElement('button');button.className=action===actions[0]?'primary':'outline';button.textContent=action.label;button.addEventListener('click',action.fn);$('modalActions').append(button)}$('modal').classList.remove('hidden')}
function closeModal(){$('modal').classList.add('hidden')}
function goHome(){closeModal();state.busy=false;show('home')}
function exitFight(){modal('MAÇI BIRAK','Ana menüye dönülsün mü?','Devam eden maçın ilerlemesi kaybolur.',[{label:'Maça dön',fn:closeModal},{label:'Ana menü',fn:goHome}])}
$('quickBtn').addEventListener('click',()=>openSelect('quick'));
$('tournamentBtn').addEventListener('click',()=>openSelect('tournament'));
document.querySelectorAll('[data-home]').forEach(b=>b.addEventListener('click',goHome));
$('roster').addEventListener('click',e=>{const card=e.target.closest('[data-fighter]');if(card)setSelected(Number(card.dataset.fighter))});
$('opponentSelect').addEventListener('change',e=>state.opponent=Number(e.target.value));
document.querySelectorAll('[data-stance]').forEach(b=>b.addEventListener('click',()=>{state.stance=b.dataset.stance;document.querySelectorAll('[data-stance]').forEach(x=>x.classList.toggle('active',x===b))}));
$('fightBtn').addEventListener('click',startFight);$('rollBtn').addEventListener('click',playTurn);$('leaveBtn').addEventListener('click',exitFight);
document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>chooseMove(b.dataset.move)));
$('soundBtn').addEventListener('click',()=>{state.sound=!state.sound;$('soundBtn').textContent=state.sound?'♪ Ses açık':'♪ Ses kapalı';if(state.sound)tone(530,.1)});
$('helpBtn').addEventListener('click',()=>modal('NASIL OYNANIR?','Hamleni seç, zarı at.','Yumruk güvenilir; tekme 1–2 zarında ıskalar. Savunma 3 hasar azaltır ve 1 can kazandırır. Kışkırtma rakibin moralini düşürür. Özel hamle enerji tüketir ve tekrar kullanmak için bekler. Turnuva için üç rakibi sırayla yen.',[{label:'Anladım',fn:closeModal}]));
document.addEventListener('keydown',e=>{if(state.phase!=='battle'||!$('modal').classList.contains('hidden'))return;const m={'1':'punch','2':'kick','3':'guard','4':'taunt','5':'special'}[e.key];if(m)chooseMove(m);if(e.key===' '){e.preventDefault();playTurn()}});
fillRoster();
