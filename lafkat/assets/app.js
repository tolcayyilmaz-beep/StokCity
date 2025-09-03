
// Simple LafKat front-end demo helpers (no backend).
const LS = {
  user: 'lafkat_user',
  completions: 'lafkat_completions',
  chat: 'lafkat_chat',
  settings: 'lafkat_settings',
  friends: 'lafkat_friends',
  tokens: 'lafkat_tokens'
};
function $(sel, ctx=document){ return ctx.querySelector(sel); }
function $all(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }
function toast(msg){
  const t = document.createElement('div');
  t.className='toast show';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>{t.classList.remove('show');t.remove()}, 1800);
}
function getUser(){ try { return JSON.parse(localStorage.getItem(LS.user)) } catch(e){ return null } }
function setUser(u){ localStorage.setItem(LS.user, JSON.stringify(u)); syncHeader(); }
function logout(){ localStorage.removeItem(LS.user); syncHeader(); location.href = 'index.html'; }
function syncHeader(){
  const u = getUser();
  $all('.show-when-auth').forEach(el=> el.style.display = u ? '' : 'none');
  $all('.hide-when-auth').forEach(el=> el.style.display = u ? 'none' : '');
  const nn = $('.nickname'); if(nn) nn.textContent = u ? (u.nickname || 'Kullanıcı') : '';
  $all('.admin-link').forEach(el => { el.style.display = (u && u.role === 'admin') ? '' : 'none'; });
}
function applyTheme(){
  const s = JSON.parse(localStorage.getItem(LS.settings) || '{}');
  if(s.theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}
function toggleTheme(){
  const s = JSON.parse(localStorage.getItem(LS.settings) || '{}');
  s.theme = (s.theme === 'dark') ? 'light' : 'dark';
  localStorage.setItem(LS.settings, JSON.stringify(s)); applyTheme();
}
function toggleMenu(){ const m = $('.menu'); if(m) m.classList.toggle('open'); }
async function shareOrCopy(text){
  if(navigator.share){
    try{ await navigator.share({text}); }catch(e){}
  }else{
    try{ await navigator.clipboard.writeText(text); toast('Metin kopyalandı'); }
    catch(e){ alert(text); }
  }
}
function getTodayKey(){ const d = new Date(); return d.toISOString().slice(0,10); }
function getTokenInfo(){
  const all = JSON.parse(localStorage.getItem(LS.tokens) || '{}');
  const key = getTodayKey();
  if(!all[key]) all[key] = {used:0, limit:5};
  localStorage.setItem(LS.tokens, JSON.stringify(all));
  return all[key];
}
function consumeToken(){
  const all = JSON.parse(localStorage.getItem(LS.tokens) || '{}');
  const key = getTodayKey();
  if(!all[key]) all[key] = {used:0, limit:5};
  if(all[key].used < all[key].limit) {
    all[key].used++; localStorage.setItem(LS.tokens, JSON.stringify(all)); return true;
  }
  return false;
}
function addCompletion(obj){
  const arr = JSON.parse(localStorage.getItem(LS.completions) || '[]');
  arr.unshift(obj); localStorage.setItem(LS.completions, JSON.stringify(arr));
}
function getCompletions(){ return JSON.parse(localStorage.getItem(LS.completions) || '[]'); }
function voteCompletion(id, type){
  const arr = getCompletions();
  const item = arr.find(x=> x.id===id);
  if(!item) return;
  const u = getUser() || {uid:'guest'};
  item.votes = item.votes || {};
  if(item.votes[u.uid] === type) return;
  item.votes[u.uid] = type;
  item.likes = Object.values(item.votes).filter(v => v==='up').length;
  item.dislikes = Object.values(item.votes).filter(v => v==='down').length;
  localStorage.setItem(LS.completions, JSON.stringify(arr));
}
function pushChat(nick, text){
  const arr = JSON.parse(localStorage.getItem(LS.chat) || '[]');
  arr.push({nick, text, ts: Date.now()});
  localStorage.setItem(LS.chat, JSON.stringify(arr));
}
function getChat(){ return JSON.parse(localStorage.getItem(LS.chat) || '[]'); }
function addFriend(emailOrNick){
  const u = getUser(); if(!u) return;
  const F = JSON.parse(localStorage.getItem(LS.friends) || '{"requests":[],"list":[]}');
  F.requests.push({to: emailOrNick, from: u.nickname, status:'bekliyor'});
  localStorage.setItem(LS.friends, JSON.stringify(F));
}
function initTopbar(active){
  const brand = $('.brand-link');
  if(brand){ brand.href = getUser()? 'home.html':'index.html'; }
  $all('.menu a').forEach(a => { if(a.dataset.page === active) a.classList.add('active'); });
  syncHeader(); applyTheme();
}
function timeAgo(ts){
  const diff = Math.floor((Date.now() - ts)/1000);
  if(diff<60) return diff+' sn';
  const m = Math.floor(diff/60);
  if(m<60) return m+' dk';
  const h = Math.floor(m/60);
  if(h<24) return h+' sa';
  const d = Math.floor(h/24);
  return d+' g';
}
