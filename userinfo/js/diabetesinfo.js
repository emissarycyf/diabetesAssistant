tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4A90E2',
                secondary: '#6BB6FF',
                third: '#F9FAFB'
            },
            borderRadius: {
                'none': '0px',
                'sm': '2px',
                DEFAULT: '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '20px',
                '3xl': '24px',
                '6xl': '60px',
                'full': '9999px',
                'button': '4px'
            }
        }
    }
}
window.onload = function () {
    const diabetesStatus = document.getElementById('diabetesStatus');
    const typeButtons = document.querySelectorAll('.bg-white.border');
    const nextBtn = document.getElementById('nextBtn');
    let selectedType = null;
    // Toggle diabetes type visibility based on status
    diabetesStatus.addEventListener('change', function() {
        const typeSection = document.querySelector('.bg-white.rounded-lg.shadow-md.p-4.mt-4:nth-child(2)');

        if (this.value === 'yes') {
            typeSection.style.display = 'block';
        } else {
            typeSection.style.display = 'none';
            selectedType = null;
        }
    });

    // Initialize - hide type selection if default is "no"
    if (diabetesStatus.value === 'no') {
        document.querySelector('.bg-white.rounded-lg.shadow-md.p-4.mt-4:nth-child(2)').style.display = 'none';
    }

    // Handle type selection
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selection from all buttons
            typeButtons.forEach(btn => {
                btn.classList.remove('border-primary', 'bg-third');
            });
            
            // Add selection to clicked button
            this.classList.add('border-primary', 'bg-third');
            selectedType = this.querySelector('p:first-child').textContent;
        });
    });

    // Handle next button click
    nextBtn.addEventListener('click', function() {
        if (diabetesStatus.value === 'yes' && !selectedType) {
            alert('请选择糖尿病类型');
            return;
        }

        const result = diabetesStatus.value === 'no' ? '否' : selectedType;
        window.location.replace(`informationGathering.html?disease=${encodeURIComponent(result)}`);
    }); 
}