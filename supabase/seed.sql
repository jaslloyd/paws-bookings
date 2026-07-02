-- Paws — seed data. Run AFTER schema.sql. Mirrors the current in-app seeds.
-- Dollar-quoted ($$...$$) text so apostrophes don't need escaping.

-- ── Sitter ─────────────────────────────────────────────────────
insert into sitters (id, slug, name, avatar, headline, bio, area, photos, whatsapp)
values (
  'sitter-1',
  'jason-south-dublin',
  $$Jason & Rachelle$$,
  'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/q3nf6kz7u1p8ng6k5eyldcvl.jpg',
  $$Trusted care from a dog-loving duo with shelter experience$$,
  $$Hi! We're Jason and Rachelle, a passionate couple of pet lovers with a deep appreciation for dogs of all shapes and sizes. We've volunteered extensively at Ash Animal Rescue, working with dogs of all temperaments — from helping nervous dogs learn to trust again to caring for rescues. We've raised our own dogs too: a Labrador, a Jack Russell, and a Pyrenean Sheepdog. We work from home, so we can provide round-the-clock care on weekdays and weekends. Our spacious duplex (90m²) has a safe courtyard for playtime, and we're near Memorial Park for regular walks. We don't have a residential dog at the moment and only accept one booking at a time. We do accept multiple dogs as long as they're from the same family.$$,
  $$Dublin 8$$,
  array[
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/8xQD_b510RTeYq7laiGNo-gtQew.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/ytrx_6jyP8kBXQ55mT7tkagvaFI.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/NliegsoaPpcbeCXzdfalWptP-aI.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/aM0jtClQFH39RrMfM1dHEuB2Nfs.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/Km8GGMetRsGdWcr8tnrwkw0O0R4.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/8rbncTG7CA4Okk_CPWijyhdHXA0.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/yG9nR5FGDM2S4fx_NaUsLfRuOno.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/roch-W5tkRt0D9TJOzeqae-2DxM.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/1LbfVZENv5jWotQSnUCm54RK0qk.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/fDE1UJprFt0o8bfyWFbbLkJZTBw.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/0rSiRt-dQAaMdLYYIpJryGfMHbo.jpg',
    'https://assets.pawshakecdn.io/eu/images/EU_T0Bw8ym9aZMixZb5owCUAHWF2da2/h6SIUsieyffgh9DDLJJQHyw6f_A.jpg'
  ],
  '+353 87 000 0000'
);

-- ── Services ───────────────────────────────────────────────────
insert into services (id, sitter_id, name, unit, base_rate, additional_pet_rate, active) values
  ('svc-boarding', 'sitter-1', $$Dog boarding$$,   'night', 53, 24, true),
  ('svc-daycare',  'sitter-1', $$Doggy day care$$, 'day',   42, 17, true),
  ('svc-walking',  'sitter-1', $$Dog walking$$,    'walk',  15,  5, true);

-- ── Reviews ────────────────────────────────────────────────────
insert into reviews (sitter_id, author, rating, date, text) values
  ('sitter-1', $$Sarah M.$$, 5, '2026-05-22', $$Jason and Rachelle were amazing with our anxious rescue, Bobby. Daily photo updates and he came home so relaxed and happy. Couldn't recommend them more!$$),
  ('sitter-1', $$David K.$$, 5, '2026-05-09', $$Our Lab Bella had the best week. Lovely couple, great communication, and you can tell they genuinely love dogs. Will absolutely book again.$$),
  ('sitter-1', $$Aoife L.$$, 5, '2026-04-27', $$First time leaving our pup and they put us totally at ease. The courtyard and daily walks were perfect for her. 10/10.$$),
  ('sitter-1', $$Conor B.$$, 5, '2026-04-15', $$Super flexible with drop-off and pickup, and sent us updates throughout. Max clearly had a great time. Thank you both!$$),
  ('sitter-1', $$Niamh O.$$, 5, '2026-03-30', $$They looked after our senior dog with so much care, including his medication without any fuss. Real peace of mind.$$),
  ('sitter-1', $$Emma R.$$,  5, '2026-03-12', $$Brilliant from start to finish. Friendly, reliable and our two terriers were spoiled rotten. Highly recommend.$$),
  ('sitter-1', $$Liam W.$$,  5, '2026-02-21', $$Booked day care a few times now and it's always great. Easy to arrange and the dogs love going.$$),
  ('sitter-1', $$Grace H.$$, 5, '2026-02-03', $$Kind, professional and great with nervous dogs. Our collie warmed to them instantly. We'll be back!$$);

-- ── Reservations: one sample request + manual blocks ───────────
insert into reservations
  (sitter_id, source, service_id, start_date, end_date, status, pets, quoted_price,
   contact_name, contact_email, contact_phone, pet_details, message)
values
  ('sitter-1', 'direct', 'svc-boarding', '2026-08-03', '2026-08-05', 'pending', 1, 106,
   $$Aoife Byrne$$, 'aoife@example.com', '+353 86 123 4567',
   $$Milo, 3yo Cocker Spaniel. Friendly, needs 2 walks a day.$$,
   $$Away for a wedding — hoping you have space!$$);

insert into reservations (sitter_id, source, title, start_date, end_date, status, notes) values
  ('sitter-1', 'manual', $$Unavailable$$, '2026-07-01', '2026-07-09', 'approved', $$Imported from Pawshake availability.$$),
  ('sitter-1', 'manual', $$Unavailable$$, '2026-07-11', '2026-07-11', 'approved', $$Imported from Pawshake availability.$$),
  ('sitter-1', 'manual', $$Unavailable$$, '2026-07-14', '2026-08-02', 'approved', $$Imported from Pawshake availability.$$),
  ('sitter-1', 'manual', $$Unavailable$$, '2026-08-08', '2026-08-09', 'approved', $$Imported from Pawshake availability.$$),
  ('sitter-1', 'manual', $$Unavailable$$, '2026-08-12', '2026-08-30', 'approved', $$Imported from Pawshake availability.$$),
  ('sitter-1', 'manual', $$Unavailable$$, '2026-09-01', '2026-09-03', 'approved', $$Imported from Pawshake availability.$$),
  ('sitter-1', 'manual', $$Unavailable$$, '2026-09-06', '2026-09-08', 'approved', $$Imported from Pawshake availability.$$),
  ('sitter-1', 'manual', $$Unavailable$$, '2026-09-14', '2026-09-30', 'approved', $$Imported from Pawshake availability.$$),
  ('sitter-1', 'manual', $$Unavailable$$, '2026-10-03', '2026-10-11', 'approved', $$Imported from Pawshake availability.$$),
  ('sitter-1', 'manual', $$Unavailable$$, '2026-10-24', '2026-12-31', 'approved', $$Imported from Pawshake availability.$$);
