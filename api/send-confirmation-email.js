// Dans ton API /api/send-confirmation-email.js
// MODIFIE la partie confirmation :

if (type === 'confirmation') {
  emailData = {
    sender: {
      name: 'NEXA - UNWARE STUDIO',
      email: 'vancaemerbekepaul@gmail.com'
    },
    to: [{ email, name: firstname }],
    subject: 'Confirmez votre compte NEXA',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0a0a0a; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { 
            background: #0a0a0a; 
            color: white; 
            padding: 15px 40px; 
            text-decoration: none; 
            border-radius: 6px; 
            display: inline-block; 
            margin: 20px 0;
            font-size: 16px;
            font-weight: bold;
          }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .button-container { text-align: center; margin: 30px 0; }
          .steps { margin: 25px 0; }
          .step { margin: 15px 0; padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NEXA - UNWARE STUDIO</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${firstname},</h2>
            <p>Félicitations ! Votre compte NEXA a été créé avec succès. Pour finaliser votre inscription, confirmez votre adresse email :</p>
            
            <div class="button-container">
              <a href="https://nexa-neon.vercel.app/account/confirm-email.html?token=${confirmationLink.split('token=')[1]}" class="button">
                🎯 CONFIRMER MON EMAIL
              </a>
            </div>

            <div class="steps">
              <p><strong>Procédure :</strong></p>
              <div class="step">1. Cliquez sur le bouton "CONFIRMER MON EMAIL"</div>
              <div class="step">2. Vous serez redirigé vers la page de confirmation</div>
              <div class="step">3. Puis automatiquement vers la page de connexion</div>
              <div class="step">4. Connectez-vous avec vos identifiants</div>
            </div>

            <p>Si le bouton ne fonctionne pas, copiez ce lien :</p>
            <p style="background: #f0f0f0; padding: 10px; border-radius: 4px; word-break: break-all;">
              https://nexa-neon.vercel.app/account/confirm-email.html?token=${confirmationLink.split('token=')[1]}
            </p>

            <p><em>Ce lien expirera dans 24 heures.</em></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}
