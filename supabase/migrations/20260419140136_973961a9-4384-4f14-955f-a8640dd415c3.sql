
INSERT INTO public.restaurants
  (name, slug, cuisine, description, cover_image_url, address, rating, delivery_time_minutes, price_range, tags, is_featured, is_active, display_order)
VALUES
  ('Purwanchal Cafe','purwanchal-cafe','Thakali · Nepali','Authentic Thakali khana set in the heart of Itahari.','/seed/restaurants/purwanchal-cafe.jpg','Itahari-1, Pipal Chowk',4.9,30,'$$',ARRAY['Thakali','Nepali','Cafe'],true,true,1),
  ('Royal Biryani','royal-biryani','Biryani · Indian','Chicken biryani specialists known across Itahari.','/seed/restaurants/royal-biryani.jpg','Itahari, Dharan Road',4.8,30,'$$',ARRAY['Biryani','Chicken','Indian'],true,true,2),
  ('Bahattar Restro & Lounge','bahattar-cafe','Cafe · Coffee','Cozy cafe lounge with coffee, tea and fresh cakes.','/seed/restaurants/bahattar-cafe.jpg','Itahari, Main Road',4.7,25,'$$',ARRAY['Coffee','Tea','Cakes','Cafe'],true,true,3),
  ('Pauroti','pauroti','Bakery · Cakes','Fresh bakes, cakes and pastries every morning.','/seed/restaurants/pauroti.jpg','Itahari, Main Road',4.8,25,'$$',ARRAY['Cakes','Pastries','Coffee','Bakery'],true,true,4),
  ('Monk and Punk Chyafe','monk-and-punk','Chyafe · Drinks','A cozy chyafe vibe with hot drinks and snacks.','/seed/restaurants/monk-and-punk.jpg','Itahari, Main Road',4.7,25,'$$',ARRAY['Cafe','Drinks','Snacks','Coffee'],true,true,5),
  ('Himalayan Momo House','himalayan-momo','Nepali · Tibetan','Steamed and fried momos done right.','/seed/restaurants/dish-momos.jpg','Dharan Road',4.8,25,'$',ARRAY['Momo','Nepali','Tibetan'],false,true,6),
  ('Burger Junction','burger-junction','Burgers · Fast Food','Juicy burgers and fries, fast and fresh.','/seed/restaurants/dish-burger.jpg','Halgada',4.7,20,'$$',ARRAY['Burger','Fast Food'],false,true,7),
  ('Forno Pizzeria','forno-pizzeria','Italian · Pizza','Wood-fired pizzas with classic Italian toppings.','/seed/restaurants/dish-pizza.jpg','Koshi Highway',4.8,35,'$$$',ARRAY['Pizza','Italian'],false,true,8),
  ('Annapurna Bhojanalaya','annapurna-bhojanalaya','Thali · Nepali','Traditional dal-bhat thali, generous portions.','/seed/restaurants/dish-thali.jpg','Itahari Chowk',4.9,30,'$$',ARRAY['Thali','Nepali'],false,true,9),
  ('Munch Food Service','munch-food-service','Pizza · Snacks','Pizzas, snacks and quick bites for the family.','/seed/restaurants/dish-pizza.jpg','Itahari-4',4.6,25,'$$$',ARRAY['Pizza','Snacks','Fast Food'],false,true,10),
  ('The Mo:Mo Hub','the-momo-hub','Momo · Nepali','The momo specialists - jhol, sadeko, you name it.','/seed/restaurants/dish-momos.jpg','Itahari-Dharan Road',4.5,25,'$',ARRAY['Momo','Nepali'],false,true,11);
