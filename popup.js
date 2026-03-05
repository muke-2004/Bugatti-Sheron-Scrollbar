
const tog = document.getElementById('tog');
chrome.storage.local.get(['enabled','lightsOn'], ({enabled, lightsOn}) => {
  tog.checked = enabled !== false;
  highlight(lightsOn === true ? 'lon' : lightsOn === false ? 'loff' : 'la');
});
tog.addEventListener('change', () => chrome.storage.local.set({enabled: tog.checked}));
function setL(v) {
  chrome.storage.local.set({lightsOn: v});
  highlight(v === true ? 'lon' : v === false ? 'loff' : 'la');
}
function highlight(id) {
  ['la','lon','loff'].forEach(i => document.getElementById(i).classList.toggle('active', i===id));
}
