// ゲームコアクラス - フル機能版
class IzakayaGame {
    constructor() {
        // ゲーム状態
        this.state = {
            // 基本情報
            game: {
                year: 1,
                month: 4,
                week: 1,
                day: 1,
                shopName: '居酒屋 向日葵',
                presidentLevel: 1,
                awakening: false,
                message: '今日も頑張るぞ！'
            },
            
            // 財務
            finance: {
                cash: 500000,
                loan: 0,
                monthlySales: 0,
                monthlyProfit: 0,
                profitRate: 0,
                flRatio: 65
            },
            
            // メニュー
            menu: {
                items: [
                    { id: 1, name: '枝豆', cost: 80, price: 300, popularity: 70, sold: 0, costRate: 26.7 },
                    { id: 2, name: '刺身盛り', cost: 800, price: 1800, popularity: 85, sold: 0, costRate: 44.4 },
                    { id: 3, name: '唐揚げ', cost: 120, price: 450, popularity: 65, sold: 0, costRate: 26.7 },
                    { id: 4, name: 'ポテトフライ', cost: 60, price: 350, popularity: 60, sold: 0, costRate: 17.1 },
                    { id: 5, name: '焼き鳥', cost: 100, price: 400, popularity: 75, sold: 0, costRate: 25.0 }
                ],
                specialty: null,
                avgCostRate: 32
            },
            
            // スタッフ
            staff: {
                members: [
                    { id: 1, name: '源さん', role: '板前', emoji: '👨‍🍳', morale: 60, skill: 80, fatigue: 20, salary: 250000 },
                    { id: 2, name: 'みゆき', role: 'バイトリーダー', emoji: '👩', morale: 70, skill: 65, fatigue: 30, salary: 130000 },
                    { id: 3, name: 'タケシ', role: '新人', emoji: '🧑', morale: 90, skill: 30, fatigue: 10, salary: 100000 }
                ],
                avgMorale: 73,
                openTime: 17,
                closeTime: 0
            },
            
            // 顧客
            customer: {
                popularity: 30,
                repeatRate: 20,
                customerAvg: 2800,
                turnoverRate: 1.2,
                seats: 30,
                dailyCustomers: 45
            },
            
            // マーケティング
            marketing: {
                snsFollower: 1234,
                snsEngagement: 3.2,
                adLevel: 'none',
                reputation: 65,
                lastPost: ''
            },
            
            // 設定
            settings: {
                autoMode: false,
                speed: 'normal',
                sound: true
            }
        };
        
        // チャートインスタンス
        this.salesChart = null;
        this.salesHistory = [0, 0, 0, 0, 0, 0, 0];
        
        // 自動運転
        this.autoPilot = null;
        
        this.init();
    }
    
    init() {
        // スプラッシュ表示
        this.showSplash();
        
        // データ読み込み
        setTimeout(() => {
            this.hideSplash();
            this.setupUI();
            this.setupEventListeners();
            this.updateUI();
            this.loadFromStorage();
            this.initChart();
        }, 2000);
    }
    
    showSplash() {
        const splash = document.getElementById('splash-screen');
        const progress = document.getElementById('loading-progress');
        
        let width = 0;
        const interval = setInterval(() => {
            width += 10;
            progress.style.width = width + '%';
            if (width >= 100) {
                clearInterval(interval);
            }
        }, 100);
    }
    
    hideSplash() {
        const splash = document.getElementById('splash-screen');
        const gameApp = document.getElementById('game-app');
        
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            gameApp.style.display = 'block';
        }, 500);
    }
    
    setupUI() {
        // メニューリストを生成
        this.renderMenuList();
        
        // スタッフリストを生成
        this.renderStaffList();
    }
    
    setupEventListeners() {
        // タブ切り替え
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // 1週間進める
        document.getElementById('btn-next-week').addEventListener('click', () => this.advanceWeek());
        
        // 自動運転
        document.getElementById('btn-auto').addEventListener('click', () => this.toggleAuto());
        document.getElementById('footer-auto').addEventListener('click', () => this.toggleAuto());
        
        // ログクリア
        document.getElementById('log-clear').addEventListener('click', () => this.clearLog());
        
        // メニュー開発
        document.getElementById('btn-develop').addEventListener('click', () => this.developNewMenu());
        
        // SNS投稿
        document.getElementById('btn-post').addEventListener('click', () => this.postToSNS());
        
        // 広告出稿
        document.getElementById('btn-ad-submit').addEventListener('click', () => this.submitAd());
        
        // セーブ/ロード
        document.getElementById('footer-save').addEventListener('click', () => this.save());
        document.getElementById('footer-load').addEventListener('click', () => this.load());
    }
    
    switchTab(tabName) {
        // すべてのタブを非アクティブに
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // 選択されたタブをアクティブに
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        this.addLog(`📂 ${this.getTabName(tabName)}タブを開きました`);
    }
    
    getTabName(tab) {
        const names = {
            dashboard: 'ダッシュボード',
            menu: 'メニュー管理',
            staff: 'スタッフ管理',
            marketing: 'マーケティング',
            analysis: '経営分析'
        };
        return names[tab] || '';
    }
    
    advanceWeek() {
        // 週を進める
        this.state.game.week++;
        
        // 営業シミュレーション（7日分）
        let weekSales = 0;
        let weekProfit = 0;
        
        for (let day = 0; day < 7; day++) {
            const result = this.simulateDay(day);
            weekSales += result.sales;
            weekProfit += result.profit;
        }
        
        // 月次処理
        if (this.state.game.week > 4) {
            this.state.game.week = 1;
            this.state.game.month++;
            
            if (this.state.game.month > 12) {
                this.state.game.month = 1;
                this.state.game.year++;
            }
            
            this.settleMonth();
        }
        
        // 結果ログ
        this.addLog(`📅 第${this.state.game.week}週が終了しました`);
        this.addLog(`💰 週間売上: ¥${weekSales.toLocaleString()} | 利益: ${weekProfit >= 0 ? '+' : ''}¥${weekProfit.toLocaleString()}`, weekProfit >= 0 ? 'profit' : 'loss');
        
        // スタッフ疲労
        this.state.staff.members.forEach(staff => {
            staff.fatigue = Math.min(100, staff.fatigue + 10);
            if (staff.fatigue > 80) {
                staff.morale = Math.max(0, staff.morale - 5);
            }
        });
        
        this.updateUI();
        this.autoSave();
        
        // ランダムイベントチェック
        if (Math.random() < 0.3) {
            this.triggerRandomEvent();
        }
    }
    
    simulateDay(dayOfWeek) {
        // 基礎客数
        const dayMultipliers = [0.9, 0.7, 0.7, 0.8, 0.9, 1.5, 1.8];
        let customers = Math.floor(this.state.customer.dailyCustomers * dayMultipliers[dayOfWeek]);
        
        // 人気度補正
        customers += Math.floor(this.state.customer.popularity * 0.3);
        
        // 座席制限
        customers = Math.min(customers, this.state.customer.seats * 3);
        
        // 売上計算
        let sales = 0;
        let foodCost = 0;
        
        for (let i = 0; i < customers; i++) {
            // ランダムにメニュー選択
            const menu = this.selectRandomMenu();
            sales += menu.price;
            foodCost += menu.cost;
            menu.sold++;
            
            // ドリンク追加（70%の確率）
            if (Math.random() < 0.7) {
                sales += 600;
                foodCost += 150;
            }
        }
        
        // コスト計算
        const laborCost = this.state.staff.members.reduce((sum, s) => sum + s.salary, 0) / 30;
        const utilities = 3000;
        const totalCost = foodCost + laborCost + utilities;
        
        // 利益
        const profit = sales - totalCost;
        
        // 状態更新
        this.state.finance.monthlySales += sales;
        this.state.finance.cash += profit;
        
        return { sales, profit, customers };
    }
    
    selectRandomMenu() {
        // 人気度に応じた重み付け抽選
        const totalPopularity = this.state.menu.items.reduce((sum, item) => sum + item.popularity, 0);
        let random = Math.random() * totalPopularity;
        
        for (const item of this.state.menu.items) {
            random -= item.popularity;
            if (random <= 0) {
                return item;
            }
        }
        
        return this.state.menu.items[0];
    }
    
    settleMonth() {
        // 固定費
        const rent = 100000;
        const fixedCosts = rent;
        
        this.state.finance.cash -= fixedCosts;
        
        // 利益率計算
        const profit = this.state.finance.monthlySales - fixedCosts;
        this.state.finance.monthlyProfit = profit;
        this.state.finance.profitRate = (profit / this.state.finance.monthlySales * 100) || 0;
        
        // FL比率計算
        const foodCost = this.state.menu.items.reduce((sum, item) => sum + (item.cost * item.sold), 0);
        const laborCost = this.state.staff.members.reduce((sum, s) => sum + s.salary, 0);
        this.state.finance.flRatio = ((foodCost + laborCost) / this.state.finance.monthlySales * 100) || 0;
        
        // ログ
        this.addLog(`📊 月次決算: 月商¥${this.state.finance.monthlySales.toLocaleString()} | 利益率${this.state.finance.profitRate.toFixed(1)}%`);
        
        // 売上履歴更新
        this.salesHistory.shift();
        this.salesHistory.push(this.state.finance.monthlySales);
        this.updateChart();
        
        // リセット
        this.state.finance.monthlySales = 0;
        this.state.menu.items.forEach(item => item.sold = 0);
        
        // ゲームオーバーチェック
        if (this.state.finance.cash < -500000) {
            this.gameOver('倒産');
        } else if (this.state.finance.cash > 10000000) {
            this.gameOver('大成功');
        }
    }
    
    toggleAuto() {
        this.state.settings.autoMode = !this.state.settings.autoMode;
        
        const statusSpan = document.getElementById('auto-status');
        
        if (this.state.settings.autoMode) {
            statusSpan.textContent = 'ON';
            this.addLog('🤖 自動運転モードON');
            this.startAutoPilot();
        } else {
            statusSpan.textContent = 'OFF';
            this.addLog('🛑 自動運転モードOFF');
            this.stopAutoPilot();
        }
    }
    
    startAutoPilot() {
        if (!this.autoPilot) {
            // シンプルな自動運転（1.5秒ごとに週を進める）
            this.autoPilot = setInterval(() => {
                this.advanceWeek();
            }, 1500);
        }
    }
    
    stopAutoPilot() {
        if (this.autoPilot) {
            clearInterval(this.autoPilot);
            this.autoPilot = null;
        }
    }
    
    renderMenuList() {
        const listDiv = document.getElementById('menu-list');
        listDiv.innerHTML = '';
        
        this.state.menu.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            
            const stars = '★'.repeat(Math.floor(item.popularity / 20));
            const costClass = item.costRate > 35 ? 'high' : '';
            
            card.innerHTML = `
                <div class="menu-info">
                    <div class="menu-name">
                        <span class="popularity-star">${stars}</span> ${item.name}
                    </div>
                    <div class="menu-stats">¥${item.price} | 原価率: ${item.costRate.toFixed(1)}%</div>
                </div>
                <span class="cost-badge ${costClass}">${item.costRate.toFixed(0)}%</span>
            `;
            
            listDiv.appendChild(card);
        });
        
        // 平均原価率更新
        const avgCostRate = this.state.menu.items.reduce((sum, item) => sum + item.costRate, 0) / this.state.menu.items.length;
        document.getElementById('avg-cost-rate').textContent = avgCostRate.toFixed(1) + '%';
    }
    
    renderStaffList() {
        const listDiv = document.getElementById('staff-list');
        listDiv.innerHTML = '';
        
        this.state.staff.members.forEach(staff => {
            const card = document.createElement('div');
            card.className = 'staff-card';
            
            card.innerHTML = `
                <div class="staff-avatar">${staff.emoji}</div>
                <div class="staff-info">
                    <div class="staff-name">${staff.name}</div>
                    <div class="staff-role">${staff.role} | スキル: ${staff.skill}</div>
                    <div class="morale-gauge">
                        <div class="morale-fill" style="width: ${staff.morale}%"></div>
                    </div>
                </div>
            `;
            
            listDiv.appendChild(card);
        });
        
        // 平均士気更新
        const avgMorale = this.state.staff.members.reduce((sum, s) => sum + s.morale, 0) / this.state.staff.members.length;
        this.state.staff.avgMorale = avgMorale;
        document.getElementById('avg-morale').textContent = avgMorale.toFixed(0) + '%';
    }
    
    developNewMenu() {
        const cost = 50000;
        if (this.state.finance.cash < cost) {
            this.showToast('資金が足りません！');
            return;
        }
        
        this.state.finance.cash -= cost;
        
        const newMenus = ['焼き魚定食', '豚キムチ', '餃子', 'サラダ', 'チーズ盛り'];
        const name = newMenus[Math.floor(Math.random() * newMenus.length)];
        const menuCost = 100 + Math.floor(Math.random() * 400);
        const price = menuCost * (2.5 + Math.random() * 1.5);
        
        const newMenu = {
            id: this.state.menu.items.length + 1,
            name: name,
            cost: menuCost,
            price: Math.floor(price),
            popularity: 50 + Math.floor(Math.random() * 30),
            sold: 0,
            costRate: (menuCost / price * 100)
        };
        
        this.state.menu.items.push(newMenu);
        this.renderMenuList();
        this.addLog(`🔬 新メニュー「${name}」を開発しました！`);
        this.showToast(`新メニュー「${name}」開発！`);
        this.updateUI();
    }
    
    postToSNS() {
        const text = document.getElementById('post-text').value;
        if (!text) {
            this.showToast('投稿内容を入力してください');
            return;
        }
        
        this.state.marketing.snsFollower += Math.floor(Math.random() * 50) + 10;
        this.state.customer.popularity += 2;
        this.state.marketing.lastPost = text;
        
        document.getElementById('sns-follower').textContent = this.state.marketing.snsFollower.toLocaleString();
        document.getElementById('post-text').value = '';
        
        this.addLog(`📱 SNSに投稿しました: "${text.substring(0, 20)}..."`);
        this.showToast('投稿しました！');
        this.updateUI();
    }
    
    submitAd() {
        const adLevel = document.querySelector('input[name="ad"]:checked').value;
        const costs = { none: 0, sns: 30000, local: 100000 };
        const effects = { none: 0, sns: 5, local: 15 };
        
        const cost = costs[adLevel];
        if (cost > 0 && this.state.finance.cash < cost) {
            this.showToast('資金が足りません！');
            return;
        }
        
        if (cost > 0) {
            this.state.finance.cash -= cost;
            this.state.customer.popularity += effects[adLevel];
            this.state.marketing.adLevel = adLevel;
            
            const adNames = { sns: 'SNS広告', local: '地域情報誌' };
            this.addLog(`📢 ${adNames[adLevel]}を出稿しました（-¥${cost.toLocaleString()}）`);
            this.showToast('広告を出稿しました！');
        }
        
        this.updateUI();
    }
    
    triggerRandomEvent() {
        const events = [
            { title: '口コミで話題に！', effect: () => { this.state.customer.popularity += 5; this.state.marketing.snsFollower += 100; } },
            { title: 'スタッフが体調不良...', effect: () => { this.state.staff.avgMorale -= 10; } },
            { title: '食材費高騰', effect: () => { this.state.finance.cash -= 20000; } },
            { title: '常連客が来店！', effect: () => { this.state.finance.cash += 30000; this.state.customer.repeatRate += 2; } }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        this.addLog(`🎲 イベント: ${event.title}`);
        this.updateUI();
    }
    
    initChart() {
        const ctx = document.getElementById('sales-chart');
        if (!ctx) return;
        
        this.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['4ヶ月前', '3ヶ月前', '2ヶ月前', '先月', '今月'],
                datasets: [{
                    label: '月商',
                    data: this.salesHistory.slice(-5),
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fff3e0' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: { color: '#fff3e0' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    updateChart() {
        if (this.salesChart) {
            this.salesChart.data.datasets[0].data = this.salesHistory.slice(-5);
            this.salesChart.update();
        }
    }
    
    updateUI() {
        // ヘッダー
        document.getElementById('year').textContent = this.state.game.year;
        document.getElementById('month').textContent = this.state.game.month;
        document.getElementById('week').textContent = this.state.game.week;
        document.getElementById('cash').textContent = this.state.finance.cash.toLocaleString();
        
        // 指標カード
        document.getElementById('monthly-sales').textContent = this.state.finance.monthlySales.toLocaleString();
        document.getElementById('profit-rate').textContent = this.state.finance.profitRate.toFixed(1);
        document.getElementById('repeat-rate').textContent = this.state.customer.repeatRate.toFixed(0);
        document.getElementById('popularity').textContent = this.state.customer.popularity.toFixed(0);
        
        // 分析タブ
        document.getElementById('fl-ratio').textContent = this.state.finance.flRatio.toFixed(1) + '%';
        document.getElementById('customer-spend').textContent = '¥' + this.state.customer.customerAvg.toLocaleString();
        document.getElementById('turnover').textContent = this.state.customer.turnoverRate.toFixed(1) + '回';
        document.getElementById('seats').textContent = this.state.customer.seats + '席';
        
        // 社長メッセージ
        document.getElementById('president-message').textContent = '👨‍💼 ' + this.state.game.message;
    }
    
    addLog(message, type = '') {
        const logMessages = document.getElementById('log-messages');
        const entry = document.createElement('div');
        entry.className = 'log-entry fade-in';
        
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        entry.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-text">${message}</span>
        `;
        
        logMessages.insertBefore(entry, logMessages.firstChild);
        
        // 古いログを削除
        while (logMessages.children.length > 15) {
            logMessages.removeChild(logMessages.lastChild);
        }
    }
    
    clearLog() {
        document.getElementById('log-messages').innerHTML = '';
        this.addLog('ログをクリアしました');
    }
    
    showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    gameOver(result) {
        this.stopAutoPilot();
        const message = result === '倒産' 
            ? '資金が底をつきました...ゲームオーバー'
            : 'おめでとうございます！資金1000万円達成！';
        
        alert(message);
        
        if (confirm('ニューゲームを始めますか？')) {
            this.reset();
        }
    }
    
    save() {
        try {
            localStorage.setItem('izakaya_save', JSON.stringify(this.state));
            this.addLog('💾 セーブしました');
            this.showToast('セーブしました');
        } catch (e) {
            this.showToast('セーブに失敗しました');
        }
    }
    
    autoSave() {
        localStorage.setItem('izakaya_save', JSON.stringify(this.state));
    }
    
    load() {
        try {
            const saved = localStorage.getItem('izakaya_save');
            if (saved) {
                this.state = JSON.parse(saved);
                this.updateUI();
                this.renderMenuList();
                this.renderStaffList();
                this.addLog('📂 データをロードしました');
                this.showToast('ロードしました');
            } else {
                this.showToast('セーブデータがありません');
            }
        } catch (e) {
            this.showToast('ロードに失敗しました');
        }
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('izakaya_save');
        if (saved) {
            try {
                this.state = JSON.parse(saved);
                this.updateUI();
                this.renderMenuList();
                this.renderStaffList();
                this.addLog('📂 前回のデータを復元しました');
            } catch (e) {
                console.error('Load failed:', e);
            }
        }
    }
    
    reset() {
        if (confirm('本当にリセットしますか？')) {
            localStorage.removeItem('izakaya_save');
            location.reload();
        }
    }
}

// グローバルインスタンス
let game;
