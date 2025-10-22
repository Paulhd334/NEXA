// Dans ton API, MODIFIE la partie confirmation pour ajouter le bouton :
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
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 4px; 
            display: inline-block; 
            margin: 10px 5px;
          }
          .secondary-button {
            background: #666; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 4px; 
            display: inline-block;
            font-size: 14px;
          }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .button-container { text-align: center; margin: 25px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NEXA - UNWARE STUDIO</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${firstname},</h2>
            <p>Merci de vous être inscrit à NEXA ! Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
            
            <div class="button-container">
              <a href="${confirmationLink}" class="button">✅ Confirmer mon compte</a>
            </div>

            <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
            <p><code>${confirmationLink}</code></p>
            
            <div class="button-container">
              <a href="${window.location.origin}/login.html" class="secondary-button">🔗 Aller à la page de connexion</a>
            </div>

            <p><strong>Une fois confirmé, vous pourrez vous connecter et accéder à votre compte NEXA.</strong></p>
            <p>Ce lien expirera dans 24 heures.</p>
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
