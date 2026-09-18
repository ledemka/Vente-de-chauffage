const fs = require('fs');
const path = require('path');

const keysToAdd = {
    fr: {
        dashboard: {
            title: "Mon Tableau de Bord",
            logout: "Déconnexion",
            my_orders: "Mes Commandes",
            loading: "Chargement...",
            no_orders: "Aucune commande pour le moment.",
            stat_total: "Total commandes",
            stat_pending: "En attente payement",
            stat_paid: "Payé",
            stat_shipped: "En cour Livraison",
            stat_delivered: "Livrées",
            profile: {
                company: "Société",
                contact: "Contact",
                email: "Email",
                phone: "Téléphone",
                address: "Adresse",
                postal_code: "Code Postal",
                city: "Ville",
                edit_btn: "Modifier mes informations",
                cancel_btn: "Annuler",
                save_btn: "Enregistrer"
            }
        },
        admin: {
            orders_title: "Gestion des commandes",
            filter_all: "Toutes",
            search_placeholder: "Réf, Nom, Email...",
            loading: "Chargement...",
            no_orders: "Aucune commande trouvée.",
            table: {
                ref: "Réf",
                date: "Date",
                client: "Client",
                total: "Total TTC",
                status: "Statut (actuel)",
                action: "Action"
            },
            select_status: "Changer statut...",
            confirm_status: "Changer le statut en : ",
            update_error: "Erreur lors de la mise à jour",
            network_error: "Erreur réseau"
        },
        order: {
            filter_all: "Toutes",
            status_pending: "En attente de payement",
            status_paid: "Payé",
            status_shipped: "En cour de Livraison",
            status_delivered: "Livrée",
            table: {
                ref: "Référence",
                date: "Date",
                status: "Statut",
                total: "Total TTC"
            }
        },
        modal: {
            title: "Commande ",
            download: "Télécharger le bon de commande",
            date: "Date :",
            status: "Statut :",
            client: "Client :",
            delivery: "Livraison :",
            table: {
                article: "Article",
                details: "Détails",
                qty: "Qté",
                pu: "P.U.",
                total: "Total"
            },
            total_ttc: "Total TTC",
            not_specified: "Non spécifiée"
        }
    },
    en: {
        dashboard: {
            title: "My Dashboard",
            logout: "Logout",
            my_orders: "My Orders",
            loading: "Loading...",
            no_orders: "No orders at the moment.",
            stat_total: "Total orders",
            stat_pending: "Pending payment",
            stat_paid: "Paid",
            stat_shipped: "Shipped",
            stat_delivered: "Delivered",
            profile: {
                company: "Company",
                contact: "Contact",
                email: "Email",
                phone: "Phone",
                address: "Address",
                postal_code: "Postal Code",
                city: "City",
                edit_btn: "Edit my information",
                cancel_btn: "Cancel",
                save_btn: "Save"
            }
        },
        admin: {
            orders_title: "Orders Management",
            filter_all: "All",
            search_placeholder: "Ref, Name, Email...",
            loading: "Loading...",
            no_orders: "No orders found.",
            table: {
                ref: "Ref",
                date: "Date",
                client: "Client",
                total: "Total incl. tax",
                status: "Status (current)",
                action: "Action"
            },
            select_status: "Change status...",
            confirm_status: "Change status to: ",
            update_error: "Update error",
            network_error: "Network error"
        },
        order: {
            filter_all: "All",
            status_pending: "Pending payment",
            status_paid: "Paid",
            status_shipped: "Shipped",
            status_delivered: "Delivered",
            table: {
                ref: "Reference",
                date: "Date",
                status: "Status",
                total: "Total incl. tax"
            }
        },
        modal: {
            title: "Order ",
            download: "Download order form",
            date: "Date:",
            status: "Status:",
            client: "Client:",
            delivery: "Delivery:",
            table: {
                article: "Item",
                details: "Details",
                qty: "Qty",
                pu: "U.P.",
                total: "Total"
            },
            total_ttc: "Total incl. tax",
            not_specified: "Not specified"
        }
    },
    de: {
        dashboard: {
            title: "Mein Dashboard",
            logout: "Abmelden",
            my_orders: "Meine Bestellungen",
            loading: "Laden...",
            no_orders: "Zurzeit keine Bestellungen.",
            stat_total: "Gesamte Bestellungen",
            stat_pending: "Ausstehende Zahlung",
            stat_paid: "Bezahlt",
            stat_shipped: "Versendet",
            stat_delivered: "Geliefert",
            profile: {
                company: "Firma",
                contact: "Kontakt",
                email: "E-Mail",
                phone: "Telefon",
                address: "Adresse",
                postal_code: "Postleitzahl",
                city: "Stadt",
                edit_btn: "Meine Daten bearbeiten",
                cancel_btn: "Abbrechen",
                save_btn: "Speichern"
            }
        },
        admin: {
            orders_title: "Bestellverwaltung",
            filter_all: "Alle",
            search_placeholder: "Ref, Name, E-Mail...",
            loading: "Laden...",
            no_orders: "Keine Bestellungen gefunden.",
            table: {
                ref: "Ref",
                date: "Datum",
                client: "Kunde",
                total: "Gesamt inkl. MwSt",
                status: "Status (aktuell)",
                action: "Aktion"
            },
            select_status: "Status ändern...",
            confirm_status: "Status ändern in: ",
            update_error: "Fehler bei der Aktualisierung",
            network_error: "Netzwerkfehler"
        },
        order: {
            filter_all: "Alle",
            status_pending: "Ausstehende Zahlung",
            status_paid: "Bezahlt",
            status_shipped: "Versendet",
            status_delivered: "Geliefert",
            table: {
                ref: "Referenz",
                date: "Datum",
                status: "Status",
                total: "Gesamt inkl. MwSt"
            }
        },
        modal: {
            title: "Bestellung ",
            download: "Bestellformular herunterladen",
            date: "Datum:",
            status: "Status:",
            client: "Kunde:",
            delivery: "Lieferung:",
            table: {
                article: "Artikel",
                details: "Details",
                qty: "Menge",
                pu: "E.P.",
                total: "Gesamt"
            },
            total_ttc: "Gesamt inkl. MwSt",
            not_specified: "Nicht angegeben"
        }
    },
    nl: {
        dashboard: {
            title: "Mijn Dashboard",
            logout: "Uitloggen",
            my_orders: "Mijn Bestellingen",
            loading: "Laden...",
            no_orders: "Momenteel geen bestellingen.",
            stat_total: "Totaal bestellingen",
            stat_pending: "In afwachting van betaling",
            stat_paid: "Betaald",
            stat_shipped: "Verzonden",
            stat_delivered: "Geleverd",
            profile: {
                company: "Bedrijf",
                contact: "Contact",
                email: "E-mail",
                phone: "Telefoon",
                address: "Adres",
                postal_code: "Postcode",
                city: "Plaats",
                edit_btn: "Mijn gegevens bewerken",
                cancel_btn: "Annuleren",
                save_btn: "Opslaan"
            }
        },
        admin: {
            orders_title: "Orderbeheer",
            filter_all: "Alle",
            search_placeholder: "Ref, Naam, E-mail...",
            loading: "Laden...",
            no_orders: "Geen bestellingen gevonden.",
            table: {
                ref: "Ref",
                date: "Datum",
                client: "Klant",
                total: "Totaal incl. btw",
                status: "Status (huidig)",
                action: "Actie"
            },
            select_status: "Status wijzigen...",
            confirm_status: "Status wijzigen naar: ",
            update_error: "Fout bij bijwerken",
            network_error: "Netwerkfout"
        },
        order: {
            filter_all: "Alle",
            status_pending: "In afwachting van betaling",
            status_paid: "Betaald",
            status_shipped: "Verzonden",
            status_delivered: "Geleverd",
            table: {
                ref: "Referentie",
                date: "Datum",
                status: "Status",
                total: "Totaal incl. btw"
            }
        },
        modal: {
            title: "Bestelling ",
            download: "Bestelformulier downloaden",
            date: "Datum:",
            status: "Status:",
            client: "Klant:",
            delivery: "Levering:",
            table: {
                article: "Artikel",
                details: "Details",
                qty: "Aant",
                pu: "E.P.",
                total: "Totaal"
            },
            total_ttc: "Totaal incl. btw",
            not_specified: "Niet gespecificeerd"
        }
    }
};

const i18nDir = path.join(__dirname, '..', 'data', 'i18n');

function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}

['fr', 'en', 'de', 'nl'].forEach(lang => {
    const filePath = path.join(i18nDir, `${lang}.json`);
    let data = {};
    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    deepMerge(data, keysToAdd[lang]);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
});

console.log('i18n keys injected successfully.');
