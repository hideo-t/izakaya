// ゲームクラス
class IzakayaGame {
    constructor() {
        this.state = {
            cash: 500000,
            week: 1,
            day: 1,
            monthlySales: 0,
            popularity: 30,
            morale: 50,
            ingredients: 100, // 食材レベル
            staffSkill: 50,
            menuQuality: 30,
            dayActions: []
        };
        
        this.days = ['月', '火', '水', '木', '金', '土', '日'];
        this.init();
    }
    
    init() {
        this.updateUI();
        this.loadFromStorage();
    }
    
    // UI更新
    updateUI() {
        document.getElementById('cash').textContent = this.state.cash.toLocaleString();
        document.getElementById('week').textContent = this.state.week;
        document.getElementById('day').textContent = this.days[(this.state.day - 1) % 7];
        document.getElementById('monthly-sales').textContent = this.state.monthlySales.toLocaleString();
        document.getElementById('popularity').textContent = Math.round(this.state.popularity);
        document.getElementById('morale').textContent = Math.round(this.state.morale);
    }
    
    // ログメッセージ追加
    addLog(message, type = '') {
        const logDiv = document.getElementById('log-messages');
        const p = document.createElement('p');
        p.textContent = message;
        if (type) p.classList.add(`log-${type}`);
        logDiv.insertBefore(p, logDiv.firstChild);
        
        // 古いログを削除（最新10件まで保持）
        while (logDiv.children.length > 10) {
            logDiv.removeChild(logDiv.lastChild);
        }
    }
    
    // 食材仕入れ
    buyIngredients() {
        const cost = 10000;
        if (this.state.cash < cost) {
            this.addLog('❌ 資金が足りません！', 'loss');
            return;
        }
        
        this.state.cash -= cost;
        this.state.ingredients += 30;
        this.addLog(`🛒 食材を仕入れました（-¥${cost.toLocaleString()}）`);
        this.state.dayActions.push('ingredients');
        this.updateUI();
    }
    
    // スタッフ研修
    trainStaff() {
        const cost = 5000;
        if (this.state.cash < cost) {
            this.addLog('❌ 資金が足りません！', 'loss');
            return;
        }
        
        this.state.cash -= cost;
        this.state.staffSkill += 5;
        this.state.morale += 3;
        this.addLog(`📚 スタッフ研修を実施しました（-¥${cost.toLocaleString()}）`);
        this.state.dayActions.push('training');
        this.updateUI();
    }
    
    // メニュー改善
    updateMenu() {
        const cost = 3000;
        if (this.state.cash < cost) {
            this.addLog('❌ 資金が足りません！', 'loss');
            return;
        }
        
        this.state.cash -= cost;
        this.state.menuQuality += 5;
        this.state.popularity += 2;
        this.addLog(`📋 メニューを改善しました（-¥${cost.toLocaleString()}）`);
        this.state.dayActions.push('menu');
        this.updateUI();
    }
    
    // 休業日
    restDay() {
        const laborCost = 8000;
        this.state.cash -= laborCost;
        this.state.morale += 10;
        this.addLog(`😴 今日は休業しました。スタッフの士気が上がりました。（-¥${laborCost.toLocaleString()}）`);
        this.state.dayActions.push('rest');
        this.updateUI();
    }
    
    // 営業開始（1日進める）
    nextDay() {
        // 営業シミュレーション
        const result = this.simulateBusiness();
        
        // 結果表示
        this.showDayResult(result);
        
        // 日付を進める
        this.state.day++;
        
        // 週末処理
        if (this.state.day % 7 === 0) {
            this.state.week++;
            this.addLog(`📅 第${this.state.week}週が始まりました！`);
        }
        
        // 月末処理（4週=1ヶ月）
        if (this.state.week % 4 === 0 && this.state.day % 7 === 0) {
            this.monthEnd();
        }
        
        // 行動リセット
        this.state.dayActions = [];
        
        // 食材減少
        this.state.ingredients = Math.max(0, this.state.ingredients - 10);
        
        // スタッフ疲労
        this.state.morale = Math.max(0, this.state.morale - 2);
        
        this.updateUI();
        this.autoSave();
    }
    
    // 営業シミュレーション
    simulateBusiness() {
        // 基礎客数
        let customerCount = 15 + Math.floor(this.state.popularity * 0.3);
        
        // 曜日効果（金土日は多い）
        const dayIndex = (this.state.day - 1) % 7;
        if (dayIndex >= 4) { // 金土日
            customerCount *= 1.5;
        }
        
        // 食材不足ペナルティ
        if (this.state.ingredients < 30) {
            customerCount *= 0.7;
            this.addLog('⚠️ 食材不足で客足が減りました', 'loss');
        }
        
        // ランダム要素
        customerCount += Math.floor(Math.random() * 10 - 3);
        customerCount = Math.max(5, Math.floor(customerCount));
        
        // 客単価計算
        const basePrice = 3000;
        const menuBonus = this.state.menuQuality * 10;
        const skillBonus = this.state.staffSkill * 5;
        const averageCheck = basePrice + menuBonus + skillBonus + Math.floor(Math.random() * 1000);
        
        // 売上計算
        const sales = customerCount * averageCheck;
        
        // コスト計算
        const foodCost = Math.floor(sales * 0.35); // 原価率35%
        const laborCost = 15000; // 人件費固定
        const utilities = 3000; // 光熱費
        const totalCost = foodCost + laborCost + utilities;
        
        // 利益
        const profit = sales - totalCost;
        
        // 状態更新
        this.state.cash += profit;
        this.state.monthlySales += sales;
        
        // 人気度の変動
        if (profit > 0) {
            this.state.popularity += 0.5;
        } else {
            this.state.popularity -= 1;
        }
        this.state.popularity = Math.max(0, Math.min(100, this.state.popularity));
        
        return {
            customerCount,
            averageCheck,
            sales,
            totalCost,
            profit
        };
    }
    
    // 1日の結果表示
    showDayResult(result) {
        const profitSign = result.profit >= 0 ? '+' : '';
        const logType = result.profit >= 0 ? 'profit' : 'loss';
        
        this.addLog(
            `🍶 営業終了！客数:${result.customerCount}人 | 売上:¥${result.sales.toLocaleString()} | ` +
            `利益:${profitSign}¥${result.profit.toLocaleString()}`,
            logType
        );
        
        // 特別メッセージ
        if (result.profit > 50000) {
            this.addLog('🎉 今日は大繁盛でした！', 'profit');
        } else if (result.profit < -10000) {
            this.addLog('😰 今日は厳しい日でした...', 'loss');
        }
    }
    
    // 月末処理
    monthEnd() {
        const fixedCosts = 100000; // 家賃など
        this.state.cash -= fixedCosts;
        
        this.addLog(`📊 月末決算: 月商¥${this.state.monthlySales.toLocaleString()} | 固定費-¥${fixedCosts.toLocaleString()}`);
        
        // ゲームオーバー判定
        if (this.state.cash < 0) {
            alert('😢 資金がマイナスになりました。ゲームオーバーです...');
            this.reset();
        } else if (this.state.cash > 5000000) {
            alert('🎉 おめでとうございます！資金500万円達成！伝説の店主です！');
        }
        
        // 月間売上リセット
        this.state.monthlySales = 0;
        this.updateUI();
    }
    
    // セーブ
    save() {
        try {
            localStorage.setItem('izakaya_save', JSON.stringify(this.state));
            this.addLog('💾 セーブしました');
        } catch (e) {
            alert('セーブに失敗しました');
        }
    }
    
    // 自動セーブ
    autoSave() {
        localStorage.setItem('izakaya_save', JSON.stringify(this.state));
    }
    
    // ロード
    load() {
        try {
            const saved = localStorage.getItem('izakaya_save');
            if (saved) {
                this.state = JSON.parse(saved);
                this.updateUI();
                this.addLog('📂 データをロードしました');
            } else {
                alert('セーブデータがありません');
            }
        } catch (e) {
            alert('ロードに失敗しました');
        }
    }
    
    // ストレージから自動ロード
    loadFromStorage() {
        const saved = localStorage.getItem('izakaya_save');
        if (saved) {
            try {
                this.state = JSON.parse(saved);
                this.updateUI();
                this.addLog('📂 前回のデータを復元しました');
            } catch (e) {
                console.error('Load failed:', e);
            }
        }
    }
    
    // リセット
    reset() {
        if (confirm('本当にリセットしますか？すべてのデータが消えます。')) {
            localStorage.removeItem('izakaya_save');
            location.reload();
        }
    }
}

// ゲーム開始
const game = new IzakayaGame();
