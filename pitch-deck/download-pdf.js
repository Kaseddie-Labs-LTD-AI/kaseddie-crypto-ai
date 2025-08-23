// Simple PDF generator using jsPDF
function generatePDF() {
    // Create new PDF document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Slide 1: Title
    doc.setFontSize(24);
    doc.setTextColor(0, 212, 255);
    doc.text('Kaseddie AI', 148, 50, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 255, 136);
    doc.text('AI-Powered Cryptocurrency Trading Platform', 148, 70, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Eddie Kasamba Wahitu, CEO & Founder', 148, 90, { align: 'center' });
    doc.text('kaseddielabltd@gmail.com', 148, 100, { align: 'center' });
    doc.text('+256 769089860', 148, 110, { align: 'center' });
    
    // Slide 2: Problem
    doc.addPage();
    doc.setFontSize(20);
    doc.setTextColor(0, 212, 255);
    doc.text('The Problem', 148, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('95% of retail traders lose money', 50, 60);
    doc.text('$2.8T crypto market size', 50, 80);
    doc.text('24/7 market never sleeps', 50, 100);
    doc.text('Cryptocurrency trading is complex, emotional, and requires constant monitoring.', 50, 130);
    
    // Slide 3: Solution
    doc.addPage();
    doc.setFontSize(20);
    doc.setTextColor(0, 212, 255);
    doc.text('Our Solution', 148, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('10 AI Trading Strategies - Up to 68% success rates', 50, 60);
    doc.text('Voice Commands - Revolutionary voice trading', 50, 80);
    doc.text('Bank-Grade Security - 256-bit encryption & KYC', 50, 100);
    doc.text('Multi-Platform - Web, desktop, mobile', 50, 120);
    
    // Slide 4: Market
    doc.addPage();
    doc.setFontSize(20);
    doc.setTextColor(0, 212, 255);
    doc.text('Market Opportunity', 148, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('$2.8T Total Addressable Market', 50, 60);
    doc.text('420M Global crypto users', 50, 80);
    doc.text('15% Annual market growth', 50, 100);
    
    // Slide 5: Technology
    doc.addPage();
    doc.setFontSize(20);
    doc.setTextColor(0, 212, 255);
    doc.text('Modular Architecture on Starknet', 148, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Proving: SHARP/Stone - Zero-trust proof generation', 50, 60);
    doc.text('Interoperability: Axelar - Cross-chain RWA access', 50, 80);
    doc.text('Data: Avail - Scalable market feeds', 50, 100);
    doc.text('AI Application Layer - Our trading algorithms', 50, 120);
    
    // Slide 6: Team
    doc.addPage();
    doc.setFontSize(20);
    doc.setTextColor(0, 212, 255);
    doc.text('A Resilient Founder with Proven Execution', 148, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Eddie Kasamba Wahitu - Founder & CEO', 50, 60);
    doc.text('Self-funded, full-stack developer with deep understanding', 50, 80);
    doc.text('of both AI and blockchain architecture.', 50, 90);
    doc.text('• Full-Stack Developer', 50, 110);
    doc.text('• AI Architecture Expert', 50, 120);
    doc.text('• Blockchain Specialist', 50, 130);
    doc.text('• Self-Funded MVP', 50, 140);
    
    // Slide 7: Investment
    doc.addPage();
    doc.setFontSize(20);
    doc.setTextColor(0, 212, 255);
    doc.text('Investment Opportunity', 148, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('$1K - $10K: Seed Investors (1% equity)', 50, 60);
    doc.text('$10K - $50K: Growth Partners (3-5% equity)', 50, 80);
    doc.text('$50K+: Strategic Partners (5-15% equity)', 50, 100);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 255, 136);
    doc.text('Total Funding Goal: $500,000', 148, 130, { align: 'center' });
    
    // Slide 8: Contact
    doc.addPage();
    doc.setFontSize(24);
    doc.setTextColor(0, 212, 255);
    doc.text('Thank You', 148, 50, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Ready to revolutionize crypto trading with AI?', 148, 80, { align: 'center' });
    doc.text('Eddie Kasamba Wahitu', 148, 110, { align: 'center' });
    doc.text('kaseddielabltd@gmail.com', 148, 120, { align: 'center' });
    doc.text('+256 769089860', 148, 130, { align: 'center' });
    doc.text('kaseddie-crypto-ai.netlify.app', 148, 140, { align: 'center' });
    
    // Save the PDF
    doc.save('Kaseddie-AI-Pitch-Deck.pdf');
}

// Auto-generate PDF when page loads
window.onload = function() {
    setTimeout(generatePDF, 1000);
};