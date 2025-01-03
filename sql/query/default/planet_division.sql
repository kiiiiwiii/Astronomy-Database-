CREATE OR REPLACE VIEW TEMP_Terrestrial_planet AS
  SELECT t.tp_name as name
  FROM Terrestrial_planet t
--split
CREATE OR REPLACE VIEW TEMP_Ice_giant AS
  SELECT i.ice_name as name
  FROM Ice_giant i
--split
CREATE OR REPLACE VIEW TEMP_Gas_giant AS
  SELECT g.gas_name as name
  FROM Gas_giant g
--split
CREATE OR REPLACE VIEW STAR_PLANET_TYPES AS
  :set_types
--split
SELECT s.star_name
FROM Star s
WHERE NOT EXISTS 
  (SELECT sp1.planet_type
    FROM STAR_PLANET_TYPES sp1
    WHERE NOT EXISTS 
      (SELECT sp2.planet_type
      FROM STAR_PLANET_TYPES sp2
      WHERE sp2.star_name = s.star_name AND sp2.planet_type = sp1.planet_type))