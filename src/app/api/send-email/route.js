// src/app/api/send-email/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📨 Données reçues pour Code Kids Academy:', body);

    const { 
      name = '', 
      email = '', 
      phone = '', 
      childAge = '',
      program = '', 
      date = '',
      time = '',
      experience = '',
      message = ''
    } = body;

    // Validation des données requises
    if (!name || !email || !phone || !childAge || !program) {
      console.error('❌ Données manquantes:', { name, email, phone, childAge, program });
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires' },
        { status: 400 }
      );
    }

    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Vérifier la connexion SMTP
    await transporter.verify();
    console.log('✅ Connexion SMTP établie');

    // Mapper les programmes
    const programTypes = {
      'initiation': 'Initiation au Code (6-9 ans)',
      'web': 'Développement Web Junior (10-13 ans)',
      'python': 'Python pour Débutants (12-15 ans)',
      'roblox': 'Roblox & Game Dev (10-14 ans)',
      'cours-essai': 'Cours d\'essai gratuit seulement'
    };

    const ageGroups = {
      '6-8': '6-8 ans',
      '9-11': '9-11 ans',
      '12-14': '12-14 ans',
      '15+': '15 ans et plus'
    };

    const programLabel = programTypes[program] || program;
    const ageLabel = ageGroups[childAge] || childAge;
    const reference = `CKA-${Date.now().toString().slice(-8)}`;
    const today = new Date();
    const deadline = new Date(today);
    deadline.setHours(deadline.getHours() + (program === 'cours-essai' ? 4 : 24));

    // Email pour l'administrateur
    const adminEmail = {
      from: `"Code Kids Academy" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'contact@codekidsacademy.ma',
      replyTo: email,
      subject: `👶 NOUVELLE INSCRIPTION #${reference} - ${name} - ${programLabel}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouvelle Inscription - Code Kids Academy</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #1e293b;
                    background: linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%);
                    padding: 20px;
                    min-height: 100vh;
                }
                
                .email-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(192, 38, 211, 0.15);
                }
                
                /* Header */
                .header {
                    background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
                    padding: 40px 30px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="white"/></svg>');
                    background-size: cover;
                    opacity: 0.1;
                }
                
                .logo-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 30px;
                    position: relative;
                }
                
                .logo-circle {
                    width: 70px;
                    height: 70px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                
                .logo-text {
                    text-align: left;
                }
                
                .academy-name {
                    color: white;
                    font-size: 32px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }
                
                .academy-tagline {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 16px;
                    font-weight: 500;
                }
                
                .reference-badge {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 12px 30px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    display: inline-block;
                    margin-top: 20px;
                }
                
                /* Registration Status */
                .status-section {
                    background: ${program === 'cours-essai' ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'};
                    padding: 30px;
                    text-align: center;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: ${program === 'cours-essai' ? '#10b981' : '#8b5cf6'};
                    color: white;
      padding: 12px 30px;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 16px;
                }
                
                /* Main Content */
                .main-content {
                    padding: 40px 30px;
                }
                
                .section-title {
                    color: #7c3aed;
                    font-size: 22px;
                    font-weight: 700;
                    margin: 40px 0 25px;
                    padding-bottom: 15px;
                    border-bottom: 3px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                /* Parent Info Grid */
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .info-card {
                    background: #f8fafc;
                    border-radius: 16px;
                    padding: 25px;
                    border: 1px solid #e2e8f0;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .info-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }
                
                .info-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .info-icon {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                }
                
                .info-title {
                    color: #7c3aed;
                    font-size: 18px;
                    font-weight: 700;
                }
                
                .info-content {
                    color: #475569;
                    font-size: 15px;
                    line-height: 1.8;
                }
                
                .info-field {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #f1f5f9;
                }
                
                .info-field:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                
                .field-label {
                    color: #64748b;
                    font-size: 14px;
                    font-weight: 600;
                    min-width: 140px;
                }
                
                .field-value {
                    color: #1e293b;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                /* Child Info */
                .child-section {
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                    border: 2px solid #0ea5e9;
                    border-radius: 20px;
                    padding: 35px;
                    margin: 40px 0;
                    position: relative;
                    overflow: hidden;
                }
                
                .child-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%);
                }
                
                .child-title {
                    color: #0c4a6e;
                    font-size: 26px;
                    font-weight: 800;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }
                
                .child-info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .child-item {
                    background: white;
                    padding: 15px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                }
                
                /* Experience Section */
                ${experience ? `
                .experience-section {
                    background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
                    border: 2px solid #facc15;
                    border-radius: 20px;
                    padding: 25px;
                    margin: 30px 0;
                }
                
                .experience-title {
                    color: #854d0e;
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                ` : ''}
                
                /* Action Buttons */
                .action-buttons {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 30px 0;
                }
                
                .action-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 18px 24px;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    text-align: center;
                }
                
                .btn-call {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                }
                
                .btn-email {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                }
                
                .btn-whatsapp {
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    color: white;
                }
                
                .btn-calendar {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                }
                
                .action-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                }
                
                /* Program Details */
                .program-details {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border-radius: 16px;
                    padding: 25px;
                    margin: 30px 0;
                }
                
                .program-price {
                    display: inline-block;
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    color: white;
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-weight: 700;
                    margin-top: 10px;
                }
                
                /* Footer */
                .footer {
                    background: #7c3aed;
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .footer-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 30px;
                    margin-bottom: 30px;
                }
                
                .footer-section h4 {
                    color: white;
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 20px;
                }
                
                .footer-contact {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #cbd5e1;
                    font-size: 14px;
                }
                
                .copyright {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 25px;
                    color: #94a3b8;
                    font-size: 13px;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .header { padding: 30px 20px; }
                    .main-content { padding: 30px 20px; }
                    .info-grid { grid-template-columns: 1fr; }
                    .action-buttons { grid-template-columns: 1fr; }
                    .child-section { padding: 25px 20px; }
                    .footer-content { grid-template-columns: 1fr; }
                    
                    .logo-section {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .logo-text {
                        text-align: center;
                    }
                    
                    .child-info-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                    <div class="logo-section">
                        <div class="logo-circle">
                            <div style="font-size: 28px; color: #7c3aed;">👨‍💻</div>
                        </div>
                        <div class="logo-text">
                            <div class="academy-name">Code Kids Academy</div>
                            <div class="academy-tagline">Programmation Ludique pour Enfants • Casablanca</div>
                        </div>
                    </div>
                    
                    <div class="reference-badge">
                        NOUVELLE INSCRIPTION • #${reference}
                    </div>
                </div>

                <!-- Status Section -->
                <div class="status-section">
                    <div class="status-badge">
                        ${program === 'cours-essai' ? '🎯 COURS D\'ESSAI' : '📚 INSCRIPTION PROGRAMME'}
                        <span style="font-size: 12px; opacity: 0.9;">
                            ${programLabel}
                        </span>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="main-content">
                    <!-- Parent Information -->
                    <div class="section-title">
                        👤 Informations Parent
                    </div>
                    
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-header">
                                <div class="info-icon">👤</div>
                                <div class="info-title">Identité</div>
                            </div>
                            <div class="info-content">
                                <div class="info-field">
                                    <span class="field-label">Nom complet</span>
                                    <span class="field-value">${name}</span>
                                </div>
                                <div class="info-field">
                                    <span class="field-label">Téléphone</span>
                                    <span class="field-value">
                                        <a href="tel:${phone}" style="color: #8b5cf6; text-decoration: none;">
                                            ${phone}
                                        </a>
                                    </span>
                                </div>
                                <div class="info-field">
                                    <span class="field-label">Email</span>
                                    <span class="field-value">
                                        <a href="mailto:${email}" style="color: #8b5cf6; text-decoration: none;">
                                            ${email}
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-card">
                            <div class="info-header">
                                <div class="info-icon">📅</div>
                                <div class="info-title">Disponibilités</div>
                            </div>
                            <div class="info-content">
                                ${date ? `
                                <div class="info-field">
                                    <span class="field-label">Date souhaitée</span>
                                    <span class="field-value">${date}</span>
                                </div>
                                ` : ''}
                                ${time ? `
                                <div class="info-field">
                                    <span class="field-label">Horaire souhaité</span>
                                    <span class="field-value">${time}</span>
                                </div>
                                ` : ''}
                                <div class="info-field">
                                    <span class="field-label">Type de demande</span>
                                    <span class="field-value" style="color: ${program === 'cours-essai' ? '#10b981' : '#8b5cf6'};">
                                        ${program === 'cours-essai' ? 'Cours d\'essai gratuit' : 'Inscription programme'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Child Information -->
                    <div class="child-section">
                        <div class="child-title">
                            👶 Informations Enfant
                        </div>
                        
                        <div class="child-info-grid">
                            <div class="child-item">
                                <div style="color: #64748b; font-size: 13px; font-weight: 600; margin-bottom: 5px;">
                                    Âge de l'enfant
                                </div>
                                <div style="color: #1e293b; font-size: 18px; font-weight: 700;">
                                    ${ageLabel}
                                </div>
                            </div>
                            
                            <div class="child-item">
                                <div style="color: #64748b; font-size: 13px; font-weight: 600; margin-bottom: 5px;">
                                    Programme choisi
                                </div>
                                <div style="color: #7c3aed; font-size: 18px; font-weight: 700;">
                                    ${programLabel}
                                </div>
                            </div>
                            
                            ${program !== 'cours-essai' ? `
                            <div class="child-item">
                                <div style="color: #64748b; font-size: 13px; font-weight: 600; margin-bottom: 5px;">
                                    Durée du programme
                                </div>
                                <div style="color: #1e293b; font-size: 18px; font-weight: 700;">
                                    ${program === 'initiation' ? '12 semaines' : 
                                      program === 'web' ? '16 semaines' :
                                      program === 'python' ? '20 semaines' : '14 semaines'}
                                </div>
                            </div>
                            
                            <div class="child-item">
                                <div style="color: #64748b; font-size: 13px; font-weight: 600; margin-bottom: 5px;">
                                    Tarif mensuel
                                </div>
                                <div class="program-price">
                                    ${program === 'initiation' ? '1.200 DH' :
                                      program === 'web' ? '1.500 DH' :
                                      program === 'python' ? '1.800 DH' : '1.400 DH'}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Experience Section -->
                    ${experience ? `
                    <div class="experience-section">
                        <div class="experience-title">
                            📝 Expérience en programmation
                        </div>
                        <div style="color: #854d0e; line-height: 1.6; font-size: 15px;">
                            ${experience}
                        </div>
                        <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #facc15; color: #9ca3af; font-size: 13px; display: flex; gap: 15px;">
                            <span>📝 ${experience.length} caractères</span>
                            <span>🔤 ${experience.split(' ').length} mots</span>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Program Details -->
                    ${program !== 'cours-essai' ? `
                    <div class="section-title">
                        💼 Détails du Programme
                    </div>
                    
                    <div class="program-details">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                                <div style="color: #7c3aed; font-weight: 600; margin-bottom: 5px;">📚 Programme</div>
                                <div style="color: #475569; font-size: 14px;">${programLabel}</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                                <div style="color: #7c3aed; font-weight: 600; margin-bottom: 5px;">⏱️ Durée</div>
                                <div style="color: #475569; font-size: 14px;">
                                    ${program === 'initiation' ? '12 semaines (3 mois)' :
                                      program === 'web' ? '16 semaines (4 mois)' :
                                      program === 'python' ? '20 semaines (5 mois)' : '14 semaines (3.5 mois)'}
                                </div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                                <div style="color: #7c3aed; font-weight: 600; margin-bottom: 5px;">💰 Tarif</div>
                                <div style="color: #475569; font-size: 14px;">
                                    ${program === 'initiation' ? '1.200 DH/mois' :
                                      program === 'web' ? '1.500 DH/mois' :
                                      program === 'python' ? '1.800 DH/mois' : '1.400 DH/mois'}
                                </div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                                <div style="color: #7c3aed; font-weight: 600; margin-bottom: 5px;">🎯 Objectif</div>
                                <div style="color: #475569; font-size: 14px;">
                                    ${program === 'initiation' ? 'Initiation à la logique algorithmique' :
                                      program === 'web' ? 'Création de sites web interactifs' :
                                      program === 'python' ? 'Apprentissage Python avec projets concrets' :
                                      'Création de jeux Roblox et développement game'}
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Action Required -->
                    <div class="section-title">
                        ⚡ Action Requise
                    </div>
                    
                    <div style="background: linear-gradient(135deg, ${program === 'cours-essai' ? '#fef3c7' : '#dbeafe'} 0%, ${program === 'cours-essai' ? '#fde68a' : '#bfdbfe'} 100%); border-radius: 16px; padding: 25px; margin: 30px 0; border: 2px solid ${program === 'cours-essai' ? '#f59e0b' : '#3b82f6'};">
                        <div style="color: ${program === 'cours-essai' ? '#92400e' : '#1e40af'}; font-size: 20px; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            ${program === 'cours-essai' ? '🎯 COURS D\'ESSAI À CONFIRMER' : '📚 INSCRIPTION À VALIDER'}
                        </div>
                        
                        <div style="color: ${program === 'cours-essai' ? '#78350f' : '#1e3a8a'}; font-size: 16px; margin-bottom: 20px; font-weight: 600;">
                            ${program === 'cours-essai' 
                              ? 'Contacter le parent pour confirmer le cours d\'essai gratuit' 
                              : 'Contacter le parent pour finaliser l\'inscription et le paiement'
                            }
                        </div>
                        
                        <div style="display: inline-block; background: ${program === 'cours-essai' ? '#f59e0b' : '#3b82f6'}; color: white; padding: 8px 20px; border-radius: 50px; font-weight: 700; font-size: 14px;">
                            DÉLAI : ${program === 'cours-essai' ? '4 HEURES' : '24 HEURES'}
                        </div>
                        
                        <div class="action-buttons" style="margin-top: 30px;">
                            <a href="tel:${phone}" class="action-btn btn-call">
                                📞 Appeler le parent
                            </a>
                            <a href="mailto:${email}" class="action-btn btn-email">
                                📧 Envoyer un email
                            </a>
                            <a href="https://wa.me/${phone.replace(/\D/g, '')}" class="action-btn btn-whatsapp">
                                💬 WhatsApp
                            </a>
                            ${date ? `
                            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cours+essai+Code+Kids+Academy&dates=${date.replace(/-/g, '')}/${date.replace(/-/g, '')}&details=Pr%C3%A9nom+%3A+${encodeURIComponent(name)}%0AProgramme+%3A+${encodeURIComponent(programLabel)}%0A%C3%82ge+%3A+${encodeURIComponent(ageLabel)}" class="action-btn btn-calendar">
                                📅 Ajouter au calendrier
                            </a>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Parent Message -->
                    ${message ? `
                    <div class="section-title">
                        💬 Message du Parent
                    </div>
                    
                    <div class="info-card">
                        <div class="info-content" style="background: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #86efac;">
                            <div style="white-space: pre-wrap; line-height: 1.8; color: #065f46; font-size: 15px;">
                                ${message}
                            </div>
                            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #86efac; color: #9ca3af; font-size: 13px; display: flex; gap: 15px;">
                                <span>📝 ${message.length} caractères</span>
                                <span>🔤 ${message.split(' ').length} mots</span>
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Important Information -->
                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #7dd3fc;">
                        <div style="color: #0c4a6e; font-weight: 700; font-size: 16px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            ℹ️ Informations importantes
                        </div>
                        <div style="color: #0369a1; font-size: 14px; line-height: 1.6;">
                            • Le cours d'essai est gratuit et sans engagement<br>
                            • Matériel pédagogique fourni pour le premier cours<br>
                            • Présence d'un parent recommandée pour le premier cours<br>
                            • Horaires : Mercredi 14h-18h, Samedi 9h-12h et 14h-18h<br>
                            • Lieu : Centre ville de Casablanca, accès facile
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h4>Code Kids Academy</h4>
                            <div style="color: #cbd5e1; line-height: 1.6; font-size: 14px;">
                                Programmation ludique pour enfants à Casablanca.<br>
                                Développons la créativité et la pensée logique.
                            </div>
                        </div>
                        
                        <div class="footer-section">
                            <h4>Contact</h4>
                            <div class="footer-contact">
                                <div class="contact-item">
                                    <span>📞</span>
                                    <a href="tel:+212600000000" style="color: #cbd5e1; text-decoration: none;">
                                        +212 600 000 000
                                    </a>
                                </div>
                                <div class="contact-item">
                                    <span>📧</span>
                                    <a href="mailto:contact@codekidsacademy.ma" style="color: #cbd5e1; text-decoration: none;">
                                        contact@codekidsacademy.ma
                                    </a>
                                </div>
                                <div class="contact-item">
                                    <span>📍</span>
                                    <span>Casablanca, Maroc</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="footer-section">
                            <h4>Horaires</h4>
                            <div style="color: #cbd5e1; font-size: 14px; line-height: 1.8;">
                                <div>Mercredi : 14h-18h</div>
                                <div>Samedi : 9h-12h & 14h-18h</div>
                                <div>Cours d'essai : Sur rendez-vous</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="copyright">
                        © ${today.getFullYear()} Code Kids Academy. Tous droits réservés.<br>
                        Système de gestion des inscriptions • Référence : #${reference}
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `NOUVELLE INSCRIPTION - CODE KIDS ACADEMY
===========================================
Référence: #${reference}
Date: ${today.toLocaleDateString('fr-FR')}
Heure: ${today.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}

TYPE: ${program === 'cours-essai' ? 'COURS D\'ESSAI GRATUIT' : 'INSCRIPTION PROGRAMME'}

PARENT:
• Nom: ${name}
• Email: ${email}
• Téléphone: ${phone}

ENFANT:
• Âge: ${ageLabel}
• Programme: ${programLabel}
${program !== 'cours-essai' ? `• Durée: ${program === 'initiation' ? '12 semaines' : program === 'web' ? '16 semaines' : program === 'python' ? '20 semaines' : '14 semaines'}` : ''}
${program !== 'cours-essai' ? `• Tarif: ${program === 'initiation' ? '1.200 DH/mois' : program === 'web' ? '1.500 DH/mois' : program === 'python' ? '1.800 DH/mois' : '1.400 DH/mois'}` : ''}

DISPO:
${date ? `• Date souhaitée: ${date}` : ''}
${time ? `• Horaire souhaité: ${time}` : ''}

${experience ? `EXPÉRIENCE EN PROGRAMMATION:
${experience}
` : ''}${message ? `MESSAGE DU PARENT:
${message}
` : ''}ACTION REQUISE:
${program === 'cours-essai' 
  ? 'Contacter pour confirmer le cours d\'essai gratuit (dans les 4 heures)' 
  : 'Contacter pour finaliser l\'inscription (dans les 24 heures)'}

CONTACT RAPIDE:
• Téléphone: ${phone}
• Email: ${email}
• WhatsApp: https://wa.me/${phone.replace(/\D/g, '')}

Code Kids Academy
📞 +212 600 000 000
📧 contact@codekidsacademy.ma
📍 Casablanca, Maroc
🕐 Mercredi 14h-18h, Samedi 9h-12h & 14h-18h`
    };

    // Email de confirmation pour le parent
    const parentEmail = {
      from: `"Code Kids Academy" <${process.env.SMTP_USER}>`,
      to: email,
      cc: process.env.ADMIN_EMAIL || 'contact@codekidsacademy.ma',
      subject: `👶 Confirmation de votre demande #${reference} - Code Kids Academy`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation - Code Kids Academy</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #1e293b;
                    background: linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%);
                    padding: 20px;
                    min-height: 100vh;
                }
                
                .email-container {
                    max-width: 700px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(192, 38, 211, 0.15);
                }
                
                /* Header */
                .header {
                    background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
                    padding: 50px 30px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .confirmation-circle {
                    width: 100px;
                    height: 100px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                }
                
                .confirmation-icon {
                    font-size: 48px;
                    color: white;
                }
                
                .confirmation-title {
                    color: white;
                    font-size: 36px;
                    font-weight: 800;
                    margin-bottom: 15px;
                    letter-spacing: -0.5px;
                }
                
                .confirmation-subtitle {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 18px;
                    font-weight: 500;
                }
                
                /* Content */
                .content {
                    padding: 40px 30px;
                }
                
                .greeting {
                    text-align: center;
                    margin-bottom: 40px;
                }
                
                .greeting h2 {
                    color: #7c3aed;
                    font-size: 28px;
                    margin-bottom: 10px;
                }
                
                .greeting p {
                    color: #475569;
                    font-size: 16px;
                }
                
                /* Summary Card */
                .summary-card {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border-radius: 20px;
                    padding: 35px;
                    margin-bottom: 40px;
                    border: 2px solid #e2e8f0;
                }
                
                .summary-title {
                    color: #7c3aed;
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 25px;
                }
                
                .summary-item {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                }
                
                .item-label {
                    color: #64748b;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }
                
                .item-value {
                    color: #1e293b;
                    font-size: 18px;
                    font-weight: 700;
                }
                
                .reference-highlight {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                }
                
                /* Timeline */
                .timeline-section {
                    margin: 40px 0;
                }
                
                .section-title {
                    color: #7c3aed;
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .timeline {
                    position: relative;
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 20px;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: linear-gradient(to bottom, #8b5cf6, #ec4899);
                }
                
                .timeline-item {
                    position: relative;
                    padding-left: 60px;
                    margin-bottom: 40px;
                }
                
                .timeline-item:last-child {
                    margin-bottom: 0;
                }
                
                .timeline-icon {
                    position: absolute;
                    left: 0;
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                    z-index: 2;
                }
                
                .timeline-content {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 12px;
                    border-left: 4px solid #8b5cf6;
                }
                
                .timeline-step {
                    color: #7c3aed;
                    font-weight: 700;
                    font-size: 16px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .step-number {
                    background: #8b5cf6;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                
                /* Free Trial Card */
                ${program === 'cours-essai' ? `
                .free-trial-card {
                    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
                    border-radius: 20px;
                    padding: 35px;
                    margin: 40px 0;
                    text-align: center;
                    border: 2px solid #86efac;
                }
                
                .free-trial-title {
                    color: #065f46;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 20px;
                }
                ` : `
                .program-card {
                    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
                    border-radius: 20px;
                    padding: 35px;
                    margin: 40px 0;
                    text-align: center;
                    border: 2px solid #a5b4fc;
                }
                
                .program-title {
                    color: #3730a3;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 20px;
                }
                `}
                
                .contact-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 25px;
                    flex-wrap: wrap;
                }
                
                .contact-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 15px 25px;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .btn-phone {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                }
                
                .btn-email {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                }
                
                .btn-whatsapp {
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    color: white;
                }
                
                .contact-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }
                
                /* Footer */
                .footer {
                    background: #7c3aed;
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .footer-logo {
                    font-size: 24px;
                    font-weight: 800;
                    margin-bottom: 20px;
                    color: white;
                }
                
                .footer-tagline {
                    color: #cbd5e1;
                    font-size: 14px;
                    line-height: 1.6;
                    margin-bottom: 25px;
                }
                
                .copyright {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 25px;
                    color: #94a3b8;
                    font-size: 13px;
                }
                
                @media (max-width: 768px) {
                    .header { padding: 30px 20px; }
                    .content { padding: 30px 20px; }
                    .summary-grid { grid-template-columns: 1fr; }
                    .contact-buttons { flex-direction: column; }
                    .confirmation-title { font-size: 28px; }
                    .timeline::before { left: 15px; }
                    .timeline-item { padding-left: 50px; }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                    <div class="confirmation-circle">
                        <div class="confirmation-icon">${program === 'cours-essai' ? '🎯' : '✓'}</div>
                    </div>
                    <h1 class="confirmation-title">
                        ${program === 'cours-essai' ? 'Demande de cours d\'essai reçue !' : 'Demande d\'inscription reçue !'}
                    </h1>
                    <p class="confirmation-subtitle">
                        L'avenir numérique de votre enfant commence ici
                    </p>
                </div>

                <!-- Content -->
                <div class="content">
                    <!-- Greeting -->
                    <div class="greeting">
                        <h2>Cher(e) ${name},</h2>
                        <p>
                            Nous avons bien reçu votre demande ${program === 'cours-essai' ? 'pour un cours d\'essai gratuit' : 'd\'inscription'} 
                            au programme <strong>${programLabel}</strong>.
                            Notre équipe pédagogique vous contactera très prochainement.
                        </p>
                    </div>

                    <!-- Summary Card -->
                    <div class="summary-card">
                        <div class="summary-title">
                            📋 Récapitulatif de votre demande
                        </div>
                        
                        <div class="summary-grid">
                            <div class="summary-item">
                                <div class="item-label">Référence</div>
                                <div class="item-value">
                                    <span class="reference-highlight">#${reference}</span>
                                </div>
                            </div>
                            
                            <div class="summary-item">
                                <div class="item-label">Programme</div>
                                <div class="item-value" style="color: #7c3aed;">
                                    ${programLabel}
                                </div>
                            </div>
                            
                            <div class="summary-item">
                                <div class="item-label">Âge de l'enfant</div>
                                <div class="item-value">${ageLabel}</div>
                            </div>
                            
                            ${program !== 'cours-essai' ? `
                            <div class="summary-item">
                                <div class="item-label">Durée</div>
                                <div class="item-value">
                                    ${program === 'initiation' ? '12 semaines' : 
                                      program === 'web' ? '16 semaines' :
                                      program === 'python' ? '20 semaines' : '14 semaines'}
                                </div>
                            </div>
                            
                            <div class="summary-item">
                                <div class="item-label">Tarif mensuel</div>
                                <div class="item-value">
                                    ${program === 'initiation' ? '1.200 DH' :
                                      program === 'web' ? '1.500 DH' :
                                      program === 'python' ? '1.800 DH' : '1.400 DH'}
                                </div>
                            </div>
                            ` : ''}
                            
                            <div class="summary-item">
                                <div class="item-label">Statut</div>
                                <div class="item-value">
                                    <span style="background: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 20px; font-size: 13px;">
                                        ⏳ En attente de confirmation
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Timeline -->
                    <div class="timeline-section">
                        <h3 class="section-title">
                            🔄 Prochaines étapes
                        </h3>
                        
                        <div class="timeline">
                            <div class="timeline-item">
                                <div class="timeline-icon">📞</div>
                                <div class="timeline-content">
                                    <div class="timeline-step">
                                        <span class="step-number">1</span>
                                        Appel de confirmation
                                    </div>
                                    <p style="color: #475569;">
                                        Notre équipe vous appellera dans les 
                                        <strong>${program === 'cours-essai' ? '4 heures' : '24 heures'}</strong> 
                                        pour confirmer les détails.
                                    </p>
                                </div>
                            </div>
                            
                            <div class="timeline-item">
                                <div class="timeline-icon">📅</div>
                                <div class="timeline-content">
                                    <div class="timeline-step">
                                        <span class="step-number">2</span>
                                        ${program === 'cours-essai' ? 'Planification du cours d\'essai' : 'Finalisation de l\'inscription'}
                                    </div>
                                    <p style="color: #475569;">
                                        ${program === 'cours-essai' 
                                          ? 'Définition de la date et heure du cours d\'essai gratuit.' 
                                          : 'Signature du contrat et premier paiement.'
                                        }
                                    </p>
                                </div>
                            </div>
                            
                            <div class="timeline-item">
                                <div class="timeline-icon">👨‍💻</div>
                                <div class="timeline-content">
                                    <div class="timeline-step">
                                        <span class="step-number">3</span>
                                        Premier cours
                                    </div>
                                    <p style="color: #475569;">
                                        ${program === 'cours-essai' 
                                          ? 'Découverte gratuite avec notre instructeur.' 
                                          : 'Début du programme avec matériel pédagogique.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${program === 'cours-essai' ? `
                    <!-- Free Trial Card -->
                    <div class="free-trial-card">
                        <div class="free-trial-title">
                            🎯 COURS D'ESSAI GRATUIT
                        </div>
                        <p style="color: #065f46; font-size: 16px; margin-bottom: 20px; font-weight: 600;">
                            Votre enfant va découvrir la programmation de manière ludique
                        </p>
                        <p style="color: #065f46; margin-bottom: 20px;">
                            • Durée : 1 heure<br>
                            • Matériel fourni<br>
                            • Sans engagement<br>
                            • En présentiel à Casablanca
                        </p>
                        <div class="contact-buttons">
                            <a href="tel:+212600000000" class="contact-btn btn-phone">
                                📱 +212 600 000 000
                            </a>
                            <a href="mailto:contact@codekidsacademy.ma" class="contact-btn btn-email">
                                📧 contact@codekidsacademy.ma
                            </a>
                            <a href="https://wa.me/+212600000000" class="contact-btn btn-whatsapp">
                                💬 WhatsApp
                            </a>
                        </div>
                    </div>
                    ` : `
                    <!-- Program Card -->
                    <div class="program-card">
                        <div class="program-title">
                            📚 PROGRAMME ${programLabel.split(' (')[0].toUpperCase()}
                        </div>
                        <p style="color: #3730a3; font-size: 16px; margin-bottom: 20px; font-weight: 600;">
                            Votre enfant va maîtriser : ${program === 'initiation' ? 'la logique algorithmique' : 
                                                         program === 'web' ? 'le développement web' :
                                                         program === 'python' ? 'la programmation Python' : 'le développement de jeux Roblox'}
                        </p>
                        <p style="color: #3730a3; margin-bottom: 20px;">
                            • Projets concrets et amusants<br>
                            • Matériel pédagogique inclus<br>
                            • Instructeurs experts<br>
                            • Certificat de fin de programme
                        </p>
                        <div class="contact-buttons">
                            <a href="tel:+212600000000" class="contact-btn btn-phone">
                                📱 +212 600 000 000
                            </a>
                            <a href="mailto:contact@codekidsacademy.ma" class="contact-btn btn-email">
                                📧 contact@codekidsacademy.ma
                            </a>
                            <a href="https://wa.me/+212600000000" class="contact-btn btn-whatsapp">
                                💬 WhatsApp
                            </a>
                        </div>
                    </div>
                    `}

                    <!-- Important Information -->
                    <div style="background: #fffbeb; border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #fde68a;">
                        <div style="color: #92400e; font-weight: 700; font-size: 16px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            ℹ️ Informations importantes
                        </div>
                        <div style="color: #78350f; font-size: 14px; line-height: 1.6;">
                            • Présence d'un parent recommandée pour le premier cours<br>
                            • Matériel informatique fourni pour tous les cours<br>
                            • Horaires : Mercredi 14h-18h, Samedi 9h-12h et 14h-18h<br>
                            • Lieu : Centre ville de Casablanca, accès facile<br>
                            • Parking disponible à proximité
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <div class="footer-logo">Code Kids Academy</div>
                    <p class="footer-tagline">
                        Programmation ludique pour enfants • Casablanca<br>
                        Développons la créativité et la pensée logique
                    </p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 25px 0; color: #cbd5e1; font-size: 14px;">
                        <div>
                            <div style="font-weight: 600; margin-bottom: 5px;">📞 Contact</div>
                            <div>+212 600 000 000</div>
                            <div>contact@codekidsacademy.ma</div>
                        </div>
                        <div>
                            <div style="font-weight: 600; margin-bottom: 5px;">📍 Adresse</div>
                            <div>Casablanca, Maroc</div>
                            <div>Centre ville, accès facile</div>
                        </div>
                        <div>
                            <div style="font-weight: 600; margin-bottom: 5px;">🕐 Horaires cours</div>
                            <div>Mercredi : 14h-18h</div>
                            <div>Samedi : 9h-12h & 14h-18h</div>
                        </div>
                    </div>
                    
                    <div class="copyright">
                        © ${today.getFullYear()} Code Kids Academy. Tous droits réservés.<br>
                        Référence : #${reference} • ${today.toLocaleDateString('fr-FR')}
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `CHER(E) ${name.toUpperCase()},

VOTRE DEMANDE EST CONFIRMÉE

Nous avons bien reçu votre demande ${program === 'cours-essai' ? 'pour un cours d\'essai gratuit' : 'd\'inscription'} 
au programme ${programLabel.toLowerCase()}.
Notre équipe pédagogique vous contactera très prochainement.

📋 RÉCAPITULATIF:
• Référence : #${reference}
• Programme : ${programLabel}
• Âge de l'enfant : ${ageLabel}
${program !== 'cours-essai' ? `• Durée : ${program === 'initiation' ? '12 semaines' : program === 'web' ? '16 semaines' : program === 'python' ? '20 semaines' : '14 semaines'}` : ''}
${program !== 'cours-essai' ? `• Tarif : ${program === 'initiation' ? '1.200 DH/mois' : program === 'web' ? '1.500 DH/mois' : program === 'python' ? '1.800 DH/mois' : '1.400 DH/mois'}` : ''}
• Statut : En attente de confirmation

🔄 PROCHAINES ÉTAPES:
1. Appel de confirmation de notre équipe
   (dans les ${program === 'cours-essai' ? '4 heures' : '24 heures'})
2. ${program === 'cours-essai' ? 'Planification du cours d\'essai' : 'Finalisation de l\'inscription'}
3. Premier cours

${program === 'cours-essai' ? `
🎯 COURS D'ESSAI GRATUIT:
Votre enfant va découvrir la programmation de manière ludique
• Durée : 1 heure
• Matériel fourni
• Sans engagement
• En présentiel à Casablanca
` : `
📚 PROGRAMME ${programLabel.split(' (')[0].toUpperCase()}:
Votre enfant va maîtriser ${program === 'initiation' ? 'la logique algorithmique' : 
                          program === 'web' ? 'le développement web' :
                          program === 'python' ? 'la programmation Python' : 'le développement de jeux Roblox'}
• Projets concrets et amusants
• Matériel pédagogique inclus
• Instructeurs experts
• Certificat de fin de programme
`}

ℹ️ INFORMATIONS IMPORTANTES:
• Présence d'un parent recommandée pour le premier cours
• Matériel informatique fourni pour tous les cours
• Horaires : Mercredi 14h-18h, Samedi 9h-12h et 14h-18h
• Lieu : Centre ville de Casablanca, accès facile
• Parking disponible à proximité

📞 CONTACT RAPIDE:
• Téléphone : +212 600 000 000
• Email : contact@codekidsacademy.ma
• WhatsApp : +212 600 000 000

Merci de votre confiance.
L'équipe de Code Kids Academy

--
Code Kids Academy
📍 Casablanca, Maroc
📞 +212 600 000 000
📧 contact@codekidsacademy.ma
🕐 Mercredi 14h-18h, Samedi 9h-12h & 14h-18h`
    };

    // Envoi des emails
    console.log('📤 Envoi des emails...');
    
    await transporter.sendMail(adminEmail);
    console.log('✅ Email admin envoyé');
    
    await transporter.sendMail(parentEmail);
    console.log('✅ Email parent envoyé');

    return NextResponse.json(
      { 
        success: true,
        message: 'Votre demande a été envoyée avec succès. Nous vous contacterons très prochainement.',
        data: {
          name,
          email,
          phone,
          childAge: ageLabel,
          program: programLabel,
          reference: reference,
          isFreeTrial: program === 'cours-essai'
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Une erreur est survenue lors de l\'envoi de votre demande'
      },
      { status: 500 }
    );
  }
}