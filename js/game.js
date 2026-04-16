/**
 * 赛博先贤祠 — 协议重构 (Game Script)
 */
(function() {
  'use strict';

  let enemies = [];
  let currentLevel = 0;
  
  // DOM Elements
  const gameOverlay = document.getElementById('gameOverlay');
  const terminalText = document.getElementById('terminalText');
  const enemyTitle = document.getElementById('enemyTitle');
  const commandInput = document.getElementById('commandInput');
  const closeBtn = document.getElementById('closeGameBtn');
  const lootBox = document.getElementById('lootBox');

  async function loadData() {
    try {
      const res = await fetch('data/enemies.json');
      enemies = await res.json();
    } catch(e) {
      console.error('Failed to load enemies data: ', e);
    }
  }

  function typeText(element, text, speed = 30) {
    return new Promise(resolve => {
      element.innerHTML = '';
      let i = 0;
      function type() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      }
      type();
    });
  }

  async function loadLevel(index) {
    if (index >= enemies.length) {
      enemyTitle.textContent = "SYSTEM_CLEARED";
      await typeText(terminalText, ">>> 所有防壁系统均已被瓦解。东方哲学渗透比例 100%。协议重构完成。\n>>> 断开连接...");
      setTimeout(() => closeGame(), 3000);
      return;
    }

    const enemy = enemies[index];
    enemyTitle.textContent = `[ 防壁 ${enemy.level}: ${enemy.name} ]`;
    
    // Add glitch class temporarily to simulate connection
    document.querySelector('.game-terminal').classList.add('glitch-active');
    setTimeout(() => {
      document.querySelector('.game-terminal').classList.remove('glitch-active');
    }, 500);

    await typeText(terminalText, `>>> 正在连接目标节点...\n>>> ${enemy.logicStatement}\n>>> (系统提示: ${enemy.hint})`);
    
    commandInput.disabled = false;
    commandInput.value = '';
    commandInput.focus();
  }

  function checkCommand(cmd) {
    const enemy = enemies[currentLevel];
    if (!enemy) return;

    let success = false;
    // Simple verification
    enemy.weaknessKeywords.forEach(kw => {
      if (cmd.toLowerCase().includes(kw.toLowerCase())) {
        success = true;
      }
    });

    commandInput.disabled = true;

    if (success) {
      document.querySelector('.game-terminal').classList.add('glitch-success');
      typeText(terminalText, `>>> [输入命令]: ${cmd}\n>>> ${enemy.successMessage}`).then(() => {
        setTimeout(() => {
          document.querySelector('.game-terminal').classList.remove('glitch-success');
          // Add loop text
          addLoot(`[Relic碎片] 击破 ${enemy.name}`);
          currentLevel++;
          loadLevel(currentLevel);
        }, 3000);
      });
    } else {
      document.querySelector('.game-terminal').classList.add('glitch-error');
      typeText(terminalText, `>>> [输入命令]: ${cmd}\n>>> ${enemy.failureMessage}`).then(() => {
        setTimeout(() => {
          document.querySelector('.game-terminal').classList.remove('glitch-error');
          commandInput.disabled = false;
          commandInput.value = '';
          commandInput.focus();
          // Type again
          terminalText.innerHTML = `>>> 重新校准中...\n>>> ${enemy.logicStatement}\n>>> (系统提示: ${enemy.hint})`;
        }, 2000);
      });
    }
  }

  function addLoot(text) {
    const li = document.createElement('li');
    li.textContent = text;
    lootBox.appendChild(li);
  }

  function openGame() {
    gameOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentLevel = 0;
    lootBox.innerHTML = '';
    loadLevel(0);
  }

  function closeGame() {
    gameOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Init
  async function init() {
    await loadData();
    
    // Bind global open button if exists
    const btn = document.getElementById('startGameBtn');
    if (btn) btn.addEventListener('click', openGame);

    if (closeBtn) closeBtn.addEventListener('click', closeGame);

    if (commandInput) {
      commandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const val = commandInput.value.trim();
          if (val) {
            checkCommand(val);
          }
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

})();
