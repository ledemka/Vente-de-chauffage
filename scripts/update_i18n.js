const fs = require('fs');
const path = require('path');

const files = {
    fr: {
        'merci.inscription_body': "Un email d'activation a été envoyé à {{email}}. Vous devez activer votre compte avant de pouvoir vous connecter.",
        'merci.contact_body': "Votre message a bien été envoyé. Un accusé de réception a été envoyé à {{email}}. Nous vous répondrons dans les plus brefs délais.",
        'merci.devis_body': "Votre demande a bien été transmise à notre équipe. Une confirmation a été envoyée à {{email}}.",
        'confirmation.msg2': "Virement bancaire uniquement. Un email contenant nos coordonnées bancaires a été envoyé à {{email}}.",
        'confirmation.spam_notice': "Si vous ne le voyez pas d'ici quelques minutes, vérifiez votre dossier spam."
    },
    en: {
        'merci.inscription_body': "An activation email has been sent to {{email}}. You must activate your account before you can log in.",
        'merci.contact_body': "Your message has been successfully sent. An acknowledgment has been sent to {{email}}. We will reply as soon as possible.",
        'merci.devis_body': "Your request has been forwarded to our team. A confirmation has been sent to {{email}}.",
        'confirmation.msg2': "Bank transfer only. An email with our bank details has been sent to {{email}}.",
        'confirmation.spam_notice': "If you don't see it within a few minutes, check your spam folder."
    },
    de: {
        'merci.inscription_body': "Eine Aktivierungs-E-Mail wurde an {{email}} gesendet. Sie müssen Ihr Konto aktivieren, bevor Sie sich anmelden können.",
        'merci.contact_body': "Ihre Nachricht wurde erfolgreich gesendet. Eine Bestätigung wurde an {{email}} gesendet. Wir werden so schnell wie möglich antworten.",
        'merci.devis_body': "Ihre Anfrage wurde an unser Team weitergeleitet. Eine Bestätigung wurde an {{email}} gesendet.",
        'confirmation.msg2': "Nur Banküberweisung. Eine E-Mail mit unseren Bankdaten wurde an {{email}} gesendet.",
        'confirmation.spam_notice': "Wenn Sie diese nicht innerhalb weniger Minuten sehen, überprüfen Sie Ihren Spam-Ordner."
    },
    nl: {
        'merci.inscription_body': "Er is een activeringsmail verzonden naar {{email}}. U moet uw account activeren voordat u kunt inloggen.",
        'merci.contact_body': "Uw bericht is succesvol verzonden. Er is een ontvangstbevestiging verzonden naar {{email}}. We zullen zo snel mogelijk antwoorden.",
        'merci.devis_body': "Uw aanvraag is doorgestuurd naar ons team. Er is een bevestiging verzonden naar {{email}}.",
        'confirmation.msg2': "Alleen bankoverschrijving. Een e-mail met onze bankgegevens is verzonden naar {{email}}.",
        'confirmation.spam_notice': "Als u deze niet binnen enkele minuten ziet, controleer dan uw spammap."
    }
};

for (const [lang, updates] of Object.entries(files)) {
    const filePath = path.join(__dirname, `../data/i18n/${lang}.json`);
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Apply updates
    for (const [keyPath, val] of Object.entries(updates)) {
        const parts = keyPath.split('.');
        if (parts.length === 2) {
            if (!data[parts[0]]) data[parts[0]] = {};
            data[parts[0]][parts[1]] = val;
        } else {
            data[parts[0]] = val;
        }
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}
console.log('JSON files updated');
