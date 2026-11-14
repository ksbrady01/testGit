/**
 * Curated photography. All images are from Unsplash (free under the Unsplash License)
 * and are served from the Unsplash CDN (resized per device). Replace with owned/approved
 * project photography as it becomes available.
 */
const u = (id: string) => `https://images.unsplash.com/${id}`;

export const img = {
  // Thinking portraits — the creative mind
  thinkerHero: u("photo-1584598788860-2695a3a6c874"), // man, hand to chin, warm dark room
  thinkerProfile: u("photo-1515138692129-197a2c608cfd"), // profile with copper rim light
  thinkerGlasses: u("photo-1641650254048-d2975cbf78b0"), // man with glasses, dark
  thinkerWoman: u("photo-1634457000710-8ab0e71b2b87"), // woman, glasses, hand on chin
  thinkerMono: u("photo-1626858707242-cb196439a4d8"), // monochrome, hand to mouth
  thinkerUp: u("photo-1637059880830-59a90102de77"), // looking up, dark
  thinkerWarm: u("photo-1778949367469-d7cf14cbdf24"), // looking up, warm light

  // Studio & collaboration
  studioTeam: u("photo-1742440710226-450e3b85c100"),
  studioDuo: u("photo-1742440711413-da7afb0f4930"),
  studioPod: u("photo-1742440710402-721332ea7898"),
  studioDesk: u("photo-1760780567530-389d8a3fba75"),
  stickyWall: u("photo-1578450671530-5b6a7c9f32a8"),
  stickyNotes: u("photo-1580934174026-8142803ebb5b"),

  // Local service
  landscaper: u("photo-1605117882932-f9e32b03fea9"),
  landscapeCrew: u("photo-1593296402439-e1a270dd253d"),
  serviceVan: u("photo-1558803116-b443d28fa878"),
  serviceVan2: u("photo-1642720171544-14c88a30c9d5"),

  // Restaurant & lifestyle
  restaurantBooth: u("photo-1583354608715-177553a4035e"),
  restaurantHall: u("photo-1570560258879-af7f8e1447ac"),
  restaurantBar: u("photo-1709548145082-04d0cde481d4"),
  chefPlating: u("photo-1581349485608-9469926a8e5e"),
  restaurantBrick: u("photo-1526069631228-723c945bea6b"),

  // Professional services
  library: u("photo-1505664194779-8beaceb93744"),
  booksWarm: u("photo-1479142506502-19b3a3b7ff33"),
  officeGlass: u("photo-1497366754035-f200968a6e72"),
  officeFacade: u("photo-1559510881-58b92ab35929"),

  // Community, church, nonprofit
  churchGroup: u("photo-1569292567773-229e2b7521ee"),
  community: u("photo-1697490251788-21888514f669"),
  volunteers: u("photo-1560220604-1985ebfe28b1"),

  // Live & events
  concert: u("photo-1540039155733-5bb30b53aa14"),
  concertLights: u("photo-1470229722913-7c0e2dbbafd3"),
  stageCrowd: u("photo-1459749411175-04bf5292ceea"),
  studioSet: u("photo-1647427854253-b92bb40c9330"),

  // Industries
  retail: u("photo-1441984904996-e0b6ba687e04"),
  retail2: u("photo-1441986300917-64674bd600d8"),
  wellness: u("photo-1551076805-e1869033e561"),
  coffeeOwner: u("photo-1507914464562-6ff4ac29692f"),
  smallBiz: u("photo-1556740758-90de374c12ad"),
  texas: u("photo-1557335200-a65f7f032602"),
  texas2: u("photo-1545186079-6a368b49d88d"),
};

export type ImgKey = keyof typeof img;
