< !DOCTYPE html >
    <html lang="en">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Kaseddie AI - Investor Dashboard</title>
                    <!-- Google Fonts: Inter -->
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
                                <!-- Font Awesome for Icons -->
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                                    <style>
        /* Shared Root Variables from main site */
                                        :root {
                                            --primary - color: #00d4ff;
                                        --secondary-color: #ff6b35;
                                        --accent-color: #00ff88;
                                        --dark-bg: #0a0a0a;
                                        --dark-secondary: #1a1a2e;
                                        --dark-tertiary: #16213e;
                                        --text-primary: #ffffff;
                                        --text-secondary: #cccccc;
                                        --text-muted: #888888;
                                        --gradient-primary: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
                                        --gradient-secondary: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                                        --gradient-accent: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
        }

                                        /* Basic Reset */
                                        * {
                                            margin: 0;
                                        padding: 0;
                                        box-sizing: border-box;
        }

                                        body {
                                            font - family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                        background: linear-gradient(135deg, var(--dark-bg) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
                                        color: var(--text-primary);
                                        line-height: 1.6;
                                        overflow-x: hidden;
        }

                                        .container {
                                            max - width: 1200px;
                                        margin: 0 auto;
                                        padding: 0 20px;
        }

                                        /* Investor Dashboard Specific Styles */
                                        .investor-dashboard {
                                            min - height: 100vh;
                                        padding-top: 80px; /* To account for fixed header */
        }

                                        .investor-header {
                                            background: rgba(0, 0, 0, 0.9);
                                        backdrop-filter: blur(20px);
                                        border-bottom: 1px solid rgba(0, 212, 255, 0.3);
                                        padding: 20px 0;
                                        position: fixed; /* Fixed header */
                                        top: 0;
                                        width: 100%;
                                        z-index: 1000;
        }

                                        .header-content {
                                            max - width: 1200px;
                                        margin: 0 auto;
                                        padding: 0 20px;
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
        }

                                        .logo {
                                            display: flex;
                                        align-items: center;
                                        gap: 10px;
                                        font-size: 28px;
                                        font-weight: bold;
                                        text-decoration: none; /* Make logo a link */
                                        color: var(--text-primary);
        }

                                        .logo i {
                                            color: var(--primary-color);
        }

                                        .logo-accent {
                                            color: var(--secondary-color);
        }

                                        .tagline {
                                            color: #cccccc;
                                        font-size: 14px;
                                        margin-top: 5px;
        }

                                        .funding-status {
                                            display: flex;
                                        gap: 30px;
                                        align-items: center;
        }

                                        .funding-round {
                                            display: flex;
                                        flex-direction: column;
                                        align-items: center;
        }

                                        .round-label {
                                            color: #cccccc;
                                        font-size: 12px;
        }

                                        .round-status {
                                            color: var(--accent-color);
                                        font-weight: bold;
                                        font-size: 16px;
        }

                                        .target-amount .label {
                                            color: #cccccc;
                                        font-size: 12px;
        }

                                        .target-amount .amount {
                                            color: var(--primary-color);
                                        font-weight: bold;
                                        font-size: 18px;
        }

                                        section {
                                            padding: 80px 0;
                                        opacity: 0;
                                        transform: translateY(30px);
                                        transition: all 0.8s ease-out;
        }

                                        section.animate-in {
                                            opacity: 1;
                                        transform: translateY(0);
        }

                                        section h2 {
                                            color: var(--primary-color);
                                        font-size: 32px;
                                        margin-bottom: 40px;
                                        text-align: center;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        gap: 15px;
        }

                                        .summary-grid,
                                        .projections-grid,
                                        .tech-grid,
                                        .tiers-grid,
                                        .team-grid {
                                            display: grid;
                                        gap: 30px;
                                        margin-top: 40px;
        }

                                        .summary-grid {
                                            grid - template - columns: repeat(auto-fit, minmax(250px, 1fr));
        }

                                        .summary-card,
                                        .projection-card,
                                        .tier-card,
                                        .team-member {
                                            background: rgba(255, 255, 255, 0.05);
                                        border: 1px solid rgba(255, 255, 255, 0.2);
                                        border-radius: 15px;
                                        padding: 30px;
                                        text-align: center;
                                        transition: all 0.3s ease;
        }

                                        .summary-card:hover,
                                        .projection-card:hover,
                                        .team-member:hover {
                                            border - color: var(--primary-color);
                                        transform: translateY(-5px);
        }

                                        .card-icon {
                                            font - size: 48px;
                                        color: var(--primary-color);
                                        margin-bottom: 20px;
        }

                                        .metric {
                                            margin - top: 20px;
        }

                                        .metric-value {
                                            display: block;
                                        font-size: 32px;
                                        font-weight: bold;
                                        color: var(--accent-color);
                                        animation: countUp 2s ease-out; /* Apply animation */
        }

                                        .metric-label {
                                            color: #cccccc;
                                        font-size: 14px;
        }

                                        .starknet-content {
                                            display: grid;
                                        grid-template-columns: 1fr 1fr;
                                        gap: 50px;
                                        align-items: center;
        }

                                        .feature-list {
                                            list - style: none;
                                        padding: 0;
        }

                                        .feature-list li {
                                            display: flex;
                                        align-items: center;
                                        gap: 15px;
                                        margin-bottom: 15px;
                                        font-size: 16px;
        }

                                        .feature-list i {
                                            color: var(--accent-color);
        }

                                        .starknet-metrics {
                                            display: flex;
                                        gap: 30px;
                                        margin-top: 30px;
        }

                                        .metric-item {
                                            text - align: center;
        }

                                        .metric-number {
                                            display: block;
                                        font-size: 24px;
                                        font-weight: bold;
                                        color: var(--primary-color);
        }

                                        .metric-desc {
                                            color: #cccccc;
                                        font-size: 12px;
        }

                                        .wallet-connect-demo {
                                            text - align: center;
        }

                                        .demo-wallet-btn {
                                            background: linear-gradient(135deg, var(--secondary-color) 0%, #f7931e 100%);
                                        border: none;
                                        color: white;
                                        padding: 15px 30px;
                                        border-radius: 25px;
                                        font-size: 16px;
                                        font-weight: bold;
                                        cursor: pointer;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        gap: 10px;
                                        margin: 0 auto 20px;
                                        transition: all 0.3s ease;
        }

                                        .demo-wallet-btn:hover {
                                            transform: translateY(-2px);
                                        box-shadow: 0 10px 25px rgba(255, 107, 53, 0.4);
        }

                                        .supported-wallets {
                                            display: flex;
                                        justify-content: center;
                                        gap: 20px;
        }

                                        .wallet-item {
                                            display: flex;
                                        align-items: center;
                                        gap: 8px;
                                        color: #cccccc;
        }

                                        .projections-grid {
                                            grid - template - columns: repeat(auto-fit, minmax(200px, 1fr));
        }

                                        .roi-calculator {
                                            background: rgba(0, 212, 255, 0.1);
                                        border: 1px solid rgba(0, 212, 255, 0.3);
                                        border-radius: 15px;
                                        padding: 30px;
                                        margin-top: 40px;
        }

                                        .roi-calculator h3 {
                                            color: var(--primary-color);
                                        margin-bottom: 20px;
        }

                                        .input-group {
                                            margin - bottom: 20px;
        }

                                        .input-group label {
                                            display: block;
                                        margin-bottom: 8px;
                                        color: #cccccc;
        }

                                        .input-group input {
                                            width: 100%;
                                        padding: 12px 15px;
                                        background: rgba(255, 255, 255, 0.1);
                                        border: 1px solid rgba(255, 255, 255, 0.3);
                                        border-radius: 8px;
                                        color: white;
                                        font-size: 16px;
        }

                                        .roi-results {
                                            background: rgba(255, 255, 255, 0.05);
                                        border-radius: 10px;
                                        padding: 20px;
                                        opacity: 0; /* Hidden initially, animated in by JS */
                                        transition: opacity 0.3s ease-in-out;
        }

                                        .roi-item {
                                            display: flex;
                                        justify-content: space-between;
                                        margin-bottom: 10px;
        }

                                        .roi-value {
                                            font - weight: bold;
                                        color: var(--accent-color);
        }

                                        .tech-grid {
                                            grid - template - columns: repeat(auto-fit, minmax(250px, 1fr));
        }

                                        .tech-category {
                                            background: rgba(255, 255, 255, 0.05);
                                        border-radius: 15px;
                                        padding: 25px;
        }

                                        .tech-category h3 {
                                            color: var(--primary-color);
                                        margin-bottom: 20px;
                                        text-align: center;
        }

                                        .tech-items {
                                            display: flex;
                                        flex-direction: column;
                                        gap: 15px;
        }

                                        .tech-item {
                                            display: flex;
                                        align-items: center;
                                        gap: 12px;
                                        color: #cccccc;
                                        transition: all 0.3s ease; /* Apply animation */
        }

                                        .tech-item i {
                                            color: var(--primary-color);
                                        font-size: 20px;
        }

                                        .tech-item:hover {
                                            transform: scale(1.05); /* Slightly larger scale on hover */
                                        color: var(--primary-color);
        }

                                        .tiers-grid {
                                            grid - template - columns: repeat(auto-fit, minmax(300px, 1fr));
        }

                                        .tier-card {
                                            position: relative;
        }

                                        .tier-card.featured {
                                            border - color: var(--accent-color);
                                        transform: scale(1.05);
                                        box-shadow: 0 20px 40px rgba(0, 255, 136, 0.3);
        }

                                        .tier-header {
                                            margin - bottom: 25px;
        }

                                        .tier-header h3 {
                                            font - size: 24px;
                                        margin-bottom: 10px;
        }

                                        .tier-amount {
                                            font - size: 20px;
                                        color: var(--primary-color);
                                        font-weight: bold;
        }

                                        .tier-badge {
                                            background: var(--accent-color);
                                        color: white;
                                        padding: 5px 10px;
                                        border-radius: 15px;
                                        font-size: 12px;
                                        margin-top: 10px;
                                        display: inline-block;
        }

                                        .tier-benefits ul {
                                            list - style: none;
                                        padding: 0;
                                        text-align: left;
        }

                                        .tier-benefits li {
                                            display: flex;
                                        align-items: center;
                                        gap: 10px;
                                        margin-bottom: 10px;
        }

                                        .tier-benefits i {
                                            color: var(--accent-color);
        }

                                        .invest-btn {
                                            width: 100%;
                                        background: linear-gradient(135deg, var(--primary-color) 0%, #0099cc 100%);
                                        border: none;
                                        color: white;
                                        padding: 15px 25px;
                                        border-radius: 25px;
                                        font-size: 16px;
                                        font-weight: bold;
                                        cursor: pointer;
                                        margin-top: 25px;
                                        transition: all 0.3s ease;
        }

                                        .invest-btn:hover {
                                            transform: translateY(-2px);
                                        box-shadow: 0 10px 25px rgba(0, 212, 255, 0.4);
        }

                                        .team-grid {
                                            grid - template - columns: repeat(auto-fit, minmax(250px, 1fr));
        }

                                        .member-avatar {
                                            width: 80px;
                                        height: 80px;
                                        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        margin: 0 auto 20px;
                                        font-size: 32px;
        }

                                        .member-role {
                                            color: var(--primary-color);
                                        font-weight: bold;
                                        margin: 10px 0;
        }

                                        .member-bio {
                                            color: #cccccc;
                                        font-size: 14px;
                                        line-height: 1.5;
                                        margin-bottom: 20px;
        }

                                        .member-links {
                                            display: flex;
                                        justify-content: center;
                                        gap: 15px;
        }

                                        .member-links a {
                                            color: var(--primary-color);
                                        font-size: 20px;
                                        transition: all 0.3s ease;
        }

                                        .member-links a:hover {
                                            color: var(--accent-color);
                                        transform: scale(1.2);
        }

                                        .contact-cta {
                                            background: rgba(0, 212, 255, 0.1);
                                        border-top: 1px solid rgba(0, 212, 255, 0.3);
        }

                                        .cta-content {
                                            text - align: center;
        }

                                        .cta-content h2 {
                                            font - size: 36px;
                                        margin-bottom: 20px;
        }

                                        .cta-content p {
                                            font - size: 18px;
                                        color: #cccccc;
                                        margin-bottom: 40px;
        }

                                        .cta-buttons {
                                            display: flex;
                                        justify-content: center;
                                        gap: 20px;
        }

                                        .cta-btn {
                                            padding: 15px 30px;
                                        border: none;
                                        border-radius: 25px;
                                        font-size: 16px;
                                        font-weight: bold;
                                        cursor: pointer;
                                        display: flex;
                                        align-items: center;
                                        gap: 10px;
                                        transition: all 0.3s ease;
        }

                                        .cta-btn.primary {
                                            background: linear-gradient(135deg, var(--primary-color) 0%, #0099cc 100%);
                                        color: white;
        }

                                        .cta-btn.secondary {
                                            background: rgba(255, 255, 255, 0.1);
                                        color: white;
                                        border: 1px solid rgba(255, 255, 255, 0.3);
        }

                                        .cta-btn:hover {
                                            transform: translateY(-2px);
                                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

                                        .contact-info-cta {
                                            display: flex;
                                        justify-content: center;
                                        gap: 30px;
                                        margin: 30px 0;
                                        flex-wrap: wrap;
        }

                                        .contact-item {
                                            display: flex;
                                        align-items: center;
                                        gap: 10px;
                                        color: #cccccc;
                                        font-size: 14px;
        }

                                        .contact-item i {
                                            color: var(--primary-color);
                                        font-size: 18px;
        }

                                        /* Modal Styles (from InvestorInterface JS) */
                                        .schedule-modal {
                                            position: fixed;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                        z-index: 3000;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
        }

                                        .modal-overlay {
                                            position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                        background: rgba(0, 0, 0, 0.8);
                                        backdrop-filter: blur(10px);
        }

                                        .modal-content {
                                            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                                        border: 1px solid rgba(0, 212, 255, 0.3);
                                        border-radius: 15px;
                                        padding: 30px;
                                        max-width: 500px;
                                        width: 90%;
                                        max-height: 80vh;
                                        overflow-y: auto;
                                        position: relative;
                                        z-index: 3001;
        }

                                        .modal-header {
                                            display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        margin-bottom: 25px;
                                        padding-bottom: 15px;
                                        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

                                        .modal-header h3 {
                                            color: var(--primary-color);
                                        margin: 0;
                                        display: flex;
                                        align-items: center;
                                        gap: 10px;
        }

                                        .close-btn {
                                            background: none;
                                        border: none;
                                        color: #ff6b35;
                                        font-size: 24px;
                                        cursor: pointer;
                                        padding: 5px;
                                        border-radius: 50%;
                                        transition: all 0.3s ease;
        }

                                        .close-btn:hover {
                                            background: rgba(255, 107, 53, 0.2);
        }

                                        .form-group {
                                            margin - bottom: 20px;
        }

                                        .form-group label {
                                            display: block;
                                        margin-bottom: 8px;
                                        color: #cccccc;
                                        font-weight: 500;
        }

                                        .form-group input,
                                        .form-group select,
                                        .form-group textarea {
                                            width: 100%;
                                        padding: 12px 15px;
                                        background: rgba(255, 255, 255, 0.1);
                                        border: 1px solid rgba(255, 255, 255, 0.3);
                                        border-radius: 8px;
                                        color: white;
                                        font-size: 14px;
                                        transition: all 0.3s ease;
        }

                                        .form-group input:focus,
                                        .form-group select:focus,
                                        .form-group textarea:focus {
                                            outline: none;
                                        border-color: var(--primary-color);
                                        box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
        }

                                        .form-group textarea {
                                            resize: vertical;
                                        min-height: 80px;
        }

                                        .submit-btn {
                                            width: 100%;
                                        background: linear-gradient(135deg, var(--primary-color) 0%, #0099cc 100%);
                                        border: none;
                                        color: white;
                                        padding: 15px 25px;
                                        border-radius: 25px;
                                        font-size: 16px;
                                        font-weight: bold;
                                        cursor: pointer;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        gap: 10px;
                                        transition: all 0.3s ease;
        }

                                        .submit-btn:hover {
                                            transform: translateY(-2px);
                                        box-shadow: 0 10px 25px rgba(0, 212, 255, 0.4);
        }

                                        /* Notification styles for investor interface */
                                        .success-notification {
                                            position: fixed;
                                        top: 20px;
                                        right: 20px;
                                        background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
                                        color: white;
                                        padding: 15px 20px;
                                        border-radius: 10px;
                                        display: flex;
                                        align-items: center;
                                        gap: 10px;
                                        z-index: 3000;
                                        animation: slideInFromRight 0.3s ease-out forwards;
                                        box-shadow: 0 10px 25px rgba(0, 255, 136, 0.4);
        }

                                        @keyframes slideInFromRight {
                                            from {
                                            transform: translateX(100%);
                                        opacity: 0;
            }
                                        to {
                                            transform: translateX(0);
                                        opacity: 1;
            }
        }

                                        /* Responsive Design */
                                        @media (max-width: 768px) {
            .header - content {
                                            flex - direction: column;
                                        gap: 20px;
                                        text-align: center;
            }

                                        .funding-status {
                                            flex - direction: column;
                                        gap: 15px;
            }

                                        .starknet-content {
                                            grid - template - columns: 1fr;
                                        gap: 30px;
            }

                                        .cta-buttons {
                                            flex - direction: column;
                                        align-items: center;
            }

                                        .cta-btn {
                                            width: 100%;
                                        max-width: 300px;
            }
                                        .summary-grid,
                                        .projections-grid,
                                        .tech-grid,
                                        .tiers-grid,
                                        .team-grid {
                                            grid - template - columns: 1fr;
            }
                                        .contact-info-cta {
                                            flex - direction: column;
                                        align-items: center;
            }
        }

                                        /* Keyframe for metric count-up */
                                        @keyframes countUp {
                                            from {opacity: 0; transform: scale(0.5); }
                                        to {opacity: 1; transform: scale(1); }
        }
                                    </style>
                                </head>
                                <body>
                                    <div class="investor-dashboard">
                                        <!-- Header -->
                                        <header class="investor-header">
                                            <div class="header-content">
                                                <a href="index.html" class="logo">
                                                    <i class="fas fa-rocket"></i>
                                                    <span>Kaseddie</span>
                                                    <span class="logo-accent">AI</span>
                                                    <span class="tagline">Investor Relations</span>
                                                </a>
                                                <div class="funding-status">
                                                    <div class="funding-round">
                                                        <span class="round-label">Current Round</span>
                                                        <span class="round-status">Series A</span>
                                                    </div>
                                                    <div class="target-amount">
                                                        <span class="label">Funding Target</span>
                                                        <span class="amount">$2.5M</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </header>

                                        <!-- Hero Section - Investor Overview -->
                                        <section id="overview" class="container">
                                            <h2><i class="fas fa-chart-pie"></i> Investor Overview</h2>
                                            <p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem; max-width: 800px; margin: 0 auto 60px;">
                                                Welcome to Kaseddie AI's Investor Dashboard. Discover our vision, market opportunity, and why we are the future of AI-powered crypto trading.
                                            </p>
                                            <div class="summary-grid">
                                                <div class="summary-card">
                                                    <div class="card-icon"><i class="fas fa-users"></i></div>
                                                    <h3>User Growth</h3>
                                                    <div class="metric">
                                                        <span class="metric-value">10,000+</span>
                                                        <span class="metric-label">Active Users (Beta)</span>
                                                    </div>
                                                </div>
                                                <div class="summary-card">
                                                    <div class="card-icon"><i class="fas fa-dollar-sign"></i></div>
                                                    <h3>Trading Volume</h3>
                                                    <div class="metric">
                                                        <span class="metric-value">$1.2M</span>
                                                        <span class="metric-label">Monthly Volume (Beta)</span>
                                                    </div>
                                                </div>
                                                <div class="summary-card">
                                                    <div class="card-icon"><i class="fas fa-percent"></i></div>
                                                    <h3>AI Success Rate</h3>
                                                    <div class="metric">
                                                        <span class="metric-value">95%</span>
                                                        <span class="metric-label">AI Strategy Accuracy</span>
                                                    </div>
                                                </div>
                                                <div class="summary-card">
                                                    <div class="card-icon"><i class="fas fa-coins"></i></div>
                                                    <h3>Supported Assets</h3>
                                                    <div class="metric">
                                                        <span class="metric-value">50+</span>
                                                        <span class="metric-label">Cryptocurrencies</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <!-- Starknet Integration Section -->
                                        <section id="starknet-advantage" class="container">
                                            <h2><i class="fas fa-layer-group"></i> Starknet Advantage</h2>
                                            <div class="starknet-content">
                                                <div class="starknet-text">
                                                    <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 30px;">
                                                        Kaseddie AI leverages Starknet, a ZK-Rollup Layer 2 solution on Ethereum, to provide unparalleled trading efficiency and cost-effectiveness. This integration is a key competitive advantage.
                                                    </p>
                                                    <ul class="feature-list">
                                                        <li><i class="fas fa-check-circle"></i> Ultra-Low Transaction Fees</li>
                                                        <li><i class="fas fa-check-circle"></i> High Throughput & Scalability</li>
                                                        <li><i class="fas fa-check-circle"></i> Improved Security via Ethereum</li>
                                                        <li><i class="fas fa-check-circle"></i> Instant Transaction Finality</li>
                                                    </ul>
                                                </div>
                                                <div class="wallet-connect-demo">
                                                    <p style="color: var(--text-muted); margin-bottom: 15px;">Connect your Starknet wallet to experience the future of trading.</p>
                                                    <button class="demo-wallet-btn" onclick="alert('Starknet wallet connection demo. In a live environment, this would initiate a wallet connection via ArgentX or Braavos.')">
                                                        <i class="fas fa-wallet"></i> Connect Starknet Wallet
                                                    </button>
                                                    <div class="supported-wallets">
                                                        <div class="wallet-item"><i class="fab fa-ethereum"></i> ArgentX</div>
                                                        <div class="wallet-item"><i class="fas fa-bravo"></i> Braavos</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <!-- Financial Projections Section -->
                                        <section id="projections" class="container">
                                            <h2><i class="fas fa-chart-line"></i> Financial Projections</h2>
                                            <p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem; max-width: 800px; margin: 0 auto 60px;">
                                                Our robust business model and rapid growth trajectory position Kaseddie AI for significant financial returns.
                                            </p>
                                            <div class="projections-grid">
                                                <div class="projection-card">
                                                    <h3>Year 1</h3>
                                                    <p style="font-size: 1.2rem; color: var(--accent-color); font-weight: bold;">$500K Revenue</p>
                                                    <p style="color: var(--text-secondary);">50,000 Users</p>
                                                </div>
                                                <div class="projection-card">
                                                    <h3>Year 2</h3>
                                                    <p style="font-size: 1.2rem; color: var(--accent-color); font-weight: bold;">$2.5M Revenue</p>
                                                    <p style="color: var(--text-secondary);">250,000 Users</p>
                                                </div>
                                                <div class="projection-card">
                                                    <h3>Year 3</h3>
                                                    <p style="font-size: 1.2rem; color: var(--accent-color); font-weight: bold;">$10M Revenue</p>
                                                    <p style="color: var(--text-secondary);">1,000,000 Users</p>
                                                </div>
                                                <div class="projection-card">
                                                    <h3>Valuation</h3>
                                                    <p style="font-size: 1.2rem; color: var(--primary-color); font-weight: bold;">$25M</p>
                                                    <p style="color: var(--text-secondary);">Pre-money (Series A)</p>
                                                </div>
                                            </div>

                                            <div class="roi-calculator">
                                                <h3>Calculate Your Potential ROI</h3>
                                                <p style="color: var(--text-muted); margin-bottom: 20px;">Enter your hypothetical investment amount to see projected returns based on our conservative growth model.</p>
                                                <div class="input-group">
                                                    <label for="investmentAmount">Investment Amount ($):</label>
                                                    <input type="number" id="investmentAmount" placeholder="e.g., 50000" min="1000">
                                                </div>
                                                <div id="roiResults" class="roi-results">
                                                    <div class="roi-item">
                                                        <span>Projected Return (3 Years):</span>
                                                        <span id="projectedReturn" class="roi-value">$0</span>
                                                    </div>
                                                    <div class="roi-item">
                                                        <span>Potential ROI:</span>
                                                        <span id="roiPercentage" class="roi-value">0%</span>
                                                    </div>
                                                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 15px;">
                                                        *Projections are estimates based on current market analysis and Kaseddie AI's growth trajectory. Actual returns may vary.
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        <!-- Technology Stack Section -->
                                        <section id="technology" class="container">
                                            <h2><i class="fas fa-code-branch"></i> Our Technology Stack</h2>
                                            <p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem; max-width: 800px; margin: 0 auto 60px;">
                                                Built on cutting-edge technologies to ensure speed, security, and scalability.
                                            </p>
                                            <div class="tech-grid">
                                                <div class="tech-category">
                                                    <h3>Blockchain & L2</h3>
                                                    <div class="tech-items">
                                                        <div class="tech-item"><i class="fab fa-ethereum"></i> Ethereum (Base Layer)</div>
                                                        <div class="tech-item"><i class="fas fa-layer-group"></i> Starknet (ZK-Rollup)</div>
                                                        <div class="tech-item"><i class="fas fa-network-wired"></i> Decentralized Protocols</div>
                                                    </div>
                                                </div>
                                                <div class="tech-category">
                                                    <h3>AI & ML</h3>
                                                    <div class="tech-items">
                                                        <div class="tech-item"><i class="fas fa-brain"></i> Deep Learning Models</div>
                                                        <div class="tech-item"><i class="fas fa-robot"></i> Reinforcement Learning</div>
                                                        <div class="tech-item"><i class="fas fa-chart-bar"></i> Predictive Analytics</div>
                                                    </div>
                                                </div>
                                                <div class="tech-category">
                                                    <h3>Security</h3>
                                                    <div class="tech-items">
                                                        <div class="tech-item"><i class="fas fa-shield-alt"></i> 256-bit Encryption</div>
                                                        <div class="tech-item"><i class="fas fa-fingerprint"></i> Multi-Factor Auth (2FA)</div>
                                                        <div class="tech-item"><i class="fas fa-user-shield"></i> KYC & AML Compliance</div>
                                                    </div>
                                                </div>
                                                <div class="tech-category">
                                                    <h3>Platform</h3>
                                                    <div class="tech-items">
                                                        <div class="tech-item"><i class="fas fa-cloud"></i> Cloud Infrastructure</div>
                                                        <div class="tech-item"><i class="fas fa-database"></i> Real-time Databases</div>
                                                        <div class="tech-item"><i class="fas fa-globe"></i> Cross-Platform Sync</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <!-- Investment Tiers Section -->
                                        <section id="investment-tiers" class="container">
                                            <h2><i class="fas fa-handshake"></i> Investment Tiers</h2>
                                            <p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem; max-width: 800px; margin: 0 auto 60px;">
                                                Choose an investment tier that aligns with your capital and desired involvement.
                                            </p>
                                            <div class="tiers-grid">
                                                <div class="tier-card">
                                                    <div class="tier-header">
                                                        <h3>Angel Investor</h3>
                                                        <p class="tier-amount">$25K - $100K</p>
                                                        <span class="tier-badge">Early Supporter</span>
                                                    </div>
                                                    <div class="tier-benefits">
                                                        <ul>
                                                            <li><i class="fas fa-check"></i> 2% Equity Allocation</li>
                                                            <li><i class="fas fa-check"></i> Quarterly Investor Updates</li>
                                                            <li><i class="fas fa-check"></i> Early Access to New Features</li>
                                                            <li><i class="fas fa-check"></i> Direct Line to Leadership</li>
                                                        </ul>
                                                    </div>
                                                    <button class="invest-btn" onclick="openInvestmentForm('angel')">Invest Now</button>
                                                </div>
                                                <div class="tier-card featured">
                                                    <div class="tier-header">
                                                        <h3>Strategic Partner</h3>
                                                        <p class="tier-amount">$100K - $500K</p>
                                                        <span class="tier-badge">Recommended</span>
                                                    </div>
                                                    <div class="tier-benefits">
                                                        <ul>
                                                            <li><i class="fas fa-check"></i> 5-10% Equity Allocation</li>
                                                            <li><i class="fas fa-check"></i> Monthly Performance Reports</li>
                                                            <li><i class="fas fa-check"></i> Advisory Board Consideration</li>
                                                            <li><i class="fas fa-check"></i> Exclusive Investor Events</li>
                                                            <li><i class="fas fa-check"></i> Priority Support</li>
                                                        </ul>
                                                    </div>
                                                    <button class="invest-btn" onclick="openInvestmentForm('strategic')">Invest Now</button>
                                                </div>
                                                <div class="tier-card">
                                                    <div class="tier-header">
                                                        <h3>Institutional Investor</h3>
                                                        <p class="tier-amount">$500K - $2M</p>
                                                        <span class="tier-badge">Major Contributor</span>
                                                    </div>
                                                    <div class="tier-benefits">
                                                        <ul>
                                                            <li><i class="fas fa-check"></i> 10-20% Equity Allocation</li>
                                                            <li><i class="fas fa-check"></i> Dedicated Account Manager</li>
                                                            <li><i class="fas fa-check"></i> Seat on Advisory Board</li>
                                                            <li><i class="fas fa-check"></i> Custom Reporting & Analytics</li>
                                                            <li><i class="fas fa-check"></i> Direct Product Input</li>
                                                            <li><i class="fas fa-check"></i> Co-marketing Opportunities</li>
                                                        </ul>
                                                    </div>
                                                    <button class="invest-btn" onclick="openInvestmentForm('institutional')">Invest Now</button>
                                                </div>
                                            </div>
                                        </section>

                                        <!-- Team Section -->
                                        <section id="team" class="container">
                                            <h2><i class="fas fa-users-cog"></i> Meet Our Leadership Team</h2>
                                            <p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem; max-width: 800px; margin: 0 auto 60px;">
                                                A blend of financial expertise, AI innovation, and blockchain mastery.
                                            </p>
                                            <div class="team-grid">
                                                <div class="team-member">
                                                    <div class="member-avatar">JK</div>
                                                    <h3>John Kaseddie</h3>
                                                    <p class="member-role">CEO & Founder</p>
                                                    <p class="member-bio">Former investment banker with 15+ years experience in fintech and capital markets. Visionary behind Kaseddie AI.</p>
                                                    <div class="member-links">
                                                        <a href="#" target="_blank"><i class="fab fa-linkedin"></i></a>
                                                        <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <!-- Call to Action Section -->
                                        <section id="contact-investors" class="contact-cta">
                                            <div class="container cta-content">
                                                <h2>Ready to Invest in the Future of Finance?</h2>
                                                <p>Partner with Kaseddie AI and be part of the next revolution in crypto trading.</p>
                                                <div class="cta-buttons">
                                                    <button class="cta-btn primary" onclick="scheduleDemo()">
                                                        <i class="fas fa-calendar-alt"></i> Schedule a Demo
                                                    </button>
                                                    <button class="cta-btn secondary" onclick="downloadPitchDeck()">
                                                        <i class="fas fa-download"></i> Download Pitch Deck
                                                    </button>
                                                </div>
                                                <div class="contact-info-cta">
                                                    <div class="contact-item">
                                                        <i class="fas fa-envelope"></i>
                                                        <span>kaseddie@hotmail.com</span>
                                                    </div>
                                                    <div class="contact-item">
                                                        <i class="fas fa-phone"></i>
                                                        <span>+256 769089860</span>
                                                    </div>
                                                    <div class="contact-item">
                                                        <i class="fab fa-whatsapp"></i>
                                                        <span>+256 784428821</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <script>
        // Investor Interface JavaScript
                                        class InvestorInterface {
                                            constructor() {
                                            this.investmentData = {
                                                angel: { min: 25000, max: 100000, equity: '2%' },
                                                strategic: { min: 100000, max: 500000, equity: '5-10%' },
                                                institutional: { min: 500000, max: 2000000, equity: '10-20%' }
                                            };
                                        this.init();
            }

                                        init() {
                                            this.setupAnimations();
                                        this.setupInteractiveElements();
                                        this.loadMetrics();
            }

                                        setupAnimations() {
                // Intersection Observer for scroll animations
                const observerOptions = {
                                            threshold: 0.1,
                                        rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                                            entries.forEach(entry => {
                                                if (entry.isIntersecting) {
                                                    entry.target.classList.add('animate-in');
                                                }
                                            });
                }, observerOptions);

                // Observe all sections
                document.querySelectorAll('section').forEach(section => {
                                            observer.observe(section);
                });
            }

                                        setupInteractiveElements() {
                                            // ROI Calculator
                                            this.setupROICalculator();

                                        // Investment form handlers
                                        this.setupInvestmentForms();

                                        // Demo scheduler
                                        this.setupDemoScheduler();
            }

                                        setupROICalculator() {
                const investmentInput = document.getElementById('investmentAmount');
                                        if (investmentInput) {
                                            investmentInput.addEventListener('input', () => {
                                                this.calculateROI();
                                            });
                }
                                        // Calculate ROI on initial load if there's a default value
                                        if (investmentInput && investmentInput.value) {
                                            this.calculateROI();
                }
            }

                                        calculateROI() {
                const investment = parseFloat(document.getElementById('investmentAmount').value) || 0;

                                        // Conservative projections based on fintech startup metrics
                                        const projectedMultiplier = 8; // 8x return over 3 years (conservative for successful fintech)
                                        const projectedReturn = investment * projectedMultiplier;
                                        const roiPercentage = ((projectedReturn - investment) / investment) * 100;

                                        document.getElementById('projectedReturn').textContent = `$${projectedReturn.toLocaleString()}`;
                                        document.getElementById('roiPercentage').textContent = `${roiPercentage.toFixed(0)}%`;

                                        // Add visual feedback
                                        const resultsDiv = document.getElementById('roiResults');
                                        resultsDiv.style.opacity = '1'; // Ensure it's visible after calculation
            }

                                        setupInvestmentForms() {
                                            // Investment tier selection
                                            document.querySelectorAll('.invest-btn').forEach(btn => {
                                                btn.addEventListener('click', (e) => {
                                                    e.preventDefault();
                                                    const tier = btn.closest('.tier-card').querySelector('h3').textContent.toLowerCase().replace(' investor', '').replace(' partner', '');
                                                    this.openInvestmentForm(tier);
                                                    // Add click animation
                                                    btn.style.transform = 'scale(0.95)';
                                                    setTimeout(() => {
                                                        btn.style.transform = 'scale(1)';
                                                    }, 150);
                                                });
                                            });
            }

                                        openInvestmentForm(tier) {
                const data = this.investmentData[tier];
                                        const message = `Investment Tier: ${tier.toUpperCase().replace('-', ' ')}\nRange: $${data.min.toLocaleString()} - $${data.max.toLocaleString()}\nEquity: ${data.equity}\n\nThank you for your interest! Our team will contact you within 24 hours to discuss the investment opportunity.`;

                                        // Use a custom notification instead of alert
                                        this.showNotification(message, 'info');
            }

                                        setupDemoScheduler() {
                // Demo scheduling functionality
                const demoBtn = document.querySelector('.cta-btn.primary');
                                        if (demoBtn) {
                                            demoBtn.addEventListener('click', () => {
                                                this.showScheduleModal();
                                            });
                }
            }

                                        loadMetrics() {
                                            // Simulate real-time metrics loading
                                            this.animateMetrics();

                // Update metrics periodically
                setInterval(() => {
                                            this.updateLiveMetrics();
                }, 30000); // Update every 30 seconds
            }

                                        animateMetrics() {
                const metrics = document.querySelectorAll('.metric-value');
                metrics.forEach((metric, index) => {
                                            // Reset animation for re-triggering if needed, though observer unobserves
                                            metric.style.animation = 'none';
                                        void metric.offsetWidth; // Trigger reflow
                                        metric.style.animation = 'countUp 2s ease-out';
                });
            }

                                        updateLiveMetrics() {
                // Simulate live metric updates (in production, this would come from API)
                const tradingVolume = document.querySelector('.summary-card .metric-value');
                                        if (tradingVolume && tradingVolume.textContent.includes('$')) {
                    const currentValue = parseFloat(tradingVolume.textContent.replace(/[$,]/g, ''));
                                        const newValue = currentValue + (Math.random() * 100000 - 50000); // Fluctuate around current value
                                        tradingVolume.textContent = `$${newValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
                }
                // You can add more metric updates here if needed
            }

                                        showScheduleModal() {
                const modal = document.createElement('div');
                                        modal.className = 'schedule-modal';
                                        modal.innerHTML = `
                                        <div class="modal-overlay" onclick="window.investorInterface.closeScheduleModal()"></div>
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h3><i class="fas fa-calendar"></i> Schedule Demo</h3>
                                                <button onclick="window.investorInterface.closeScheduleModal()" class="close-btn">&times;</button>
                                            </div>
                                            <div class="modal-body">
                                                <form id="demoForm">
                                                    <div class="form-group">
                                                        <label>Full Name:</label>
                                                        <input type="text" required placeholder="John Doe">
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Email:</label>
                                                        <input type="email" required placeholder="john@company.com">
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Company:</label>
                                                        <input type="text" placeholder="Investment Firm">
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Investment Range:</label>
                                                        <select required>
                                                            <option value="">Select range</option>
                                                            <option value="25k-100k">$25K - $100K</option>
                                                            <option value="100k-500k">$100K - $500K</option>
                                                            <option value="500k+">$500K+</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Preferred Demo Time:</label>
                                                        <select required>
                                                            <option value="">Select time</option>
                                                            <option value="morning">Morning (9AM - 12PM)</option>
                                                            <option value="afternoon">Afternoon (1PM - 5PM)</option>
                                                            <option value="evening">Evening (6PM - 8PM)</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Message (Optional):</label>
                                                        <textarea placeholder="Tell us about your investment focus..."></textarea>
                                                    </div>
                                                    <button type="submit" class="submit-btn">
                                                        <i class="fas fa-calendar-check"></i>
                                                        Schedule Demo
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                        `;

                                        document.body.appendChild(modal);

                // Handle form submission
                document.getElementById('demoForm').addEventListener('submit', (e) => {
                                            e.preventDefault();
                                        this.submitDemoRequest();
                });
            }

                                        submitDemoRequest() {
                const submitBtn = document.querySelector('.submit-btn');
                                        const originalText = submitBtn.innerHTML;

                                        // Show loading state
                                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...';
                                        submitBtn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                                            this.showNotification('Demo scheduled successfully! We\'ll contact you within 24 hours.', 'success');
                                        this.closeScheduleModal();
                                        submitBtn.innerHTML = originalText; // Reset button text
                                        submitBtn.disabled = false; // Re-enable button
                }, 2000);
            }

                                        closeScheduleModal() {
                const modal = document.querySelector('.schedule-modal');
                                        if (modal) {
                                            modal.remove();
                }
            }

                                        showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                                        notification.className = `notification ${type}`; // Using .notification class for consistency
                                        notification.textContent = message;

                                        document.body.appendChild(notification);

                setTimeout(() => {
                                            notification.style.animation = 'slideDown 0.5s ease-in forwards'; // Assuming slideDown exists
                    setTimeout(() => notification.remove(), 500);
                }, 5000);
            }
        }

                                        // Global functions for direct HTML calls
                                        function openInvestmentForm(tier) {
            if (window.investorInterface) {
                                            window.investorInterface.openInvestmentForm(tier);
            }
        }

                                        function scheduleDemo() {
            if (window.investorInterface) {
                                            window.investorInterface.showScheduleModal();
            }
        }

                                        function downloadPitchDeck() {
            // Create and download pitch deck
            const pitchDeckContent = `
                                        KASEDDIE AI - PITCH DECK
========================

EXECUTIVE SUMMARY
- Market: $2.8T cryptocurrency market
- Problem: 95% of traders lose money due to emotional decisions
- Solution: AI-powered trading platform with 95% success rate
- Traction: 10,000+ beta users, $1.2M trading volume
- Funding: Seeking $2.5M Series A

MARKET OPPORTUNITY
- Total Addressable Market: $2.8T
- Serviceable Addressable Market: $280B
- Serviceable Obtainable Market: $2.8B

PRODUCT
- 10 AI trading algorithms
- Voice command trading
- Multi-platform (Web, Mobile, Desktop)
- Starknet integration for low fees

BUSINESS MODEL
- Trading fees: 0.1% per transaction
- Premium subscriptions: $99/month
- API licensing: $10,000/month
- White-label solutions: $50,000/setup

FINANCIAL PROJECTIONS
Year 1: $500K revenue, 50K users
Year 2: $2.5M revenue, 250K users
Year 3: $10M revenue, 1M users

TEAM
- John Kaseddie: CEO, Ex-Goldman Sachs
- Sarah Chen: CTO, Ex-Google AI
- Michael Rodriguez: Head of AI, Ex-Citadel
- Alice Mutesi: Head of Operations

FUNDING REQUEST
- Amount: $2.5M Series A
- Use of funds: 40% Product Development, 30% Marketing, 20% Team, 10% Operations
- Valuation: $25M pre-money

CONTACT
Email: kaseddie@hotmail.com, kaseddie@gmail.com
Phone: +256 769089860
WhatsApp: +256 784428821
Website: kaseddie.ai
            `;

            const blob = new Blob([pitchDeckContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Kaseddie-AI-Pitch-Deck.txt';
            link.click();
            URL.revokeObjectURL(url);

            if (window.investorInterface) {
                window.investorInterface.showNotification('Pitch Deck download initiated!', 'success');
            }
        }

        function closeScheduleModal() {
            if (window.investorInterface) {
                window.investorInterface.closeScheduleModal();
            }
        }

        // Initialize investor interface
        document.addEventListener('DOMContentLoaded', () => {
            window.investorInterface = new InvestorInterface();
        });
    </script>
</body>
</html>
