import type { Core } from '@strapi/strapi';

// Diese Inhaltstypen darf jede:r lesen (find, findOne), zum Beispiel 'api::veranstaltung.veranstaltung'.
// Schreiben geht nur in der Verwaltung (Tunnel, http://localhost:1337/admin).
const OEFFENTLICH: string[] = [];

export default {
  register() {},

  // Setzt beim Start die Leserechte der Rolle «Public», damit niemand in der Verwaltung klicken muss
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const rolle = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (!rolle) return;
    for (const uid of OEFFENTLICH) {
      for (const action of [`${uid}.find`, `${uid}.findOne`]) {
        const da = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: { action, role: rolle.id } });
        if (!da) await strapi.db.query('plugin::users-permissions.permission').create({ data: { action, role: rolle.id } });
      }
    }
  },
};
