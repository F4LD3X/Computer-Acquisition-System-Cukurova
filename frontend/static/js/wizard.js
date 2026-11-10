document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementlerini Yakalama
    const cpuSelect = document.getElementById('cpuSelect');
    const mbSelect = document.getElementById('mbSelect');
    const ramSelect = document.getElementById('ramSelect');
    const psuSelect = document.getElementById('psuSelect');
    const checkRulesBtn = document.getElementById('checkRulesBtn');
    const submitBtn = document.getElementById('submitBtn');
    const statusAlert = document.getElementById('statusAlert');
    
    // Sağ Panel Kural Elementleri
    const ruleSocket = document.getElementById('rule-socket');
    const ruleRam = document.getElementById('rule-ram');
    const rulePower = document.getElementById('rule-power');

    // 1. Dinamik Filtreleme: CPU seçimine göre Anakartları filtrele
    cpuSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const requiredSocket = selectedOption.getAttribute('data-socket');

        mbSelect.disabled = false;
        mbSelect.value = ""; 
        
        // Anakart opsiyonlarını gizle/göster (basit frontend DOM manipülasyonu)
        Array.from(mbSelect.options).forEach(option => {
            if (option.value === "") {
                option.text = "Anakart Seçin...";
                return;
            }
            const mbSocket = option.getAttribute('data-socket');
            // Soket eşleşiyorsa göster, eşleşmiyorsa gizle
            if (requiredSocket && mbSocket === requiredSocket) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
        
        resetStatus();
    });
    
    // Herhangi bir parça değiştiğinde onay durumunu sıfırla
    [mbSelect, ramSelect, psuSelect].forEach(select => {
        select.addEventListener('change', resetStatus);
    });

    function resetStatus() {
        submitBtn.disabled = true;
        statusAlert.className = 'alert alert-secondary';
        statusAlert.textContent = 'Donanım seçimi değiştirildi, uyumluluğu tekrar kontrol edin.';
        ruleSocket.innerHTML = '<small>🔄 Soket Uyumluluğu: Bekleniyor</small>';
        ruleRam.innerHTML = '<small>🔄 RAM Uyumluluğu: Bekleniyor</small>';
        rulePower.innerHTML = '<small>🔄 Güç Yeterliliği: Bekleniyor</small>';
    }

    // 2. Uyumluluk Kontrolü (Business Rules Engine - Frontend Simülasyonu)
    checkRulesBtn.addEventListener('click', () => {
        const cpuOpt = cpuSelect.options[cpuSelect.selectedIndex];
        const mbOpt = mbSelect.options[mbSelect.selectedIndex];
        const ramOpt = ramSelect.options[ramSelect.selectedIndex];
        const psuOpt = psuSelect.options[psuSelect.selectedIndex];

        // Boş seçim kontrolü
        if (!cpuOpt.value || !mbOpt.value || !ramOpt.value || !psuOpt.value) {
            alert("Lütfen uyumluluk kontrolü için tüm donanımları seçin.");
            return;
        }

        let isCompatible = true;

        // Kural 1: Soket Uyumluluğu (Backend'e gitmeden hızlı frontend validasyonu)
        if (cpuOpt.getAttribute('data-socket') === mbOpt.getAttribute('data-socket')) {
            ruleSocket.innerHTML = '<small class="text-success">✅ Soket Uyumluluğu: Başarılı</small>';
        } else {
            ruleSocket.innerHTML = '<small class="text-danger">❌ Soket Uyumluluğu: Hatalı (Uyumsuz Soket)</small>';
            isCompatible = false;
        }

        // Kural 2: RAM Uyumluluğu
        if (ramOpt.getAttribute('data-type') === mbOpt.getAttribute('data-ram')) {
            ruleRam.innerHTML = '<small class="text-success">✅ RAM Uyumluluğu: Başarılı</small>';
        } else {
            ruleRam.innerHTML = '<small class="text-danger">❌ RAM Uyumluluğu: Hatalı (DDR Sürümü Uyumsuz)</small>';
            isCompatible = false;
        }

        // Kural 3: Güç Yeterliliği (Temsili olarak minimum 600W kuralı)
        const psuWatt = parseInt(psuOpt.getAttribute('data-watt'));
        if (psuWatt >= 600) {
            rulePower.innerHTML = '<small class="text-success">✅ Güç Yeterliliği: Başarılı</small>';
        } else {
            rulePower.innerHTML = '<small class="text-danger">❌ Güç Yeterliliği: Yetersiz (Min 600W Gerekli)</small>';
            isCompatible = false;
        }

        // Genel Sonuç Kararı
        if (isCompatible) {
            statusAlert.className = 'alert alert-success fw-bold';
            statusAlert.textContent = '✅ Tüm parçalar uyumlu! Talebi onaya gönderebilirsiniz.';
            submitBtn.disabled = false;
        } else {
            statusAlert.className = 'alert alert-danger fw-bold';
            statusAlert.textContent = '❌ Donanım uyumsuzlukları var. Lütfen kırmızı ile işaretlenen parçaları değiştirin.';
            submitBtn.disabled = true;
        }
    });
    
    // 3. Form Gönderimi (Veriyi Backend'e Yollama)
    document.getElementById('configuratorForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gelecekte Python Backend tamamlandığında buraya yazılacak Fetch/API kodu:
        /*
        const requestData = {
            cpu: cpuSelect.value,
            motherboard: mbSelect.value,
            ram: ramSelect.value,
            psu: psuSelect.value
        };
        fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        }).then(res => res.json()).then(data => { ... });
        */
        
        alert("Talep başarıyla oluşturuldu ve Onay Paneline iletildi! (Simülasyon)");
        // Formu temizle ve başa dön
        e.target.reset();
        mbSelect.disabled = true;
        resetStatus();
    });
});