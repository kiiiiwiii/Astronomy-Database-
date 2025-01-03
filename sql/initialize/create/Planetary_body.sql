CREATE TABLE Planetary_body (
  pb_name VARCHAR2(20),
  pb_diameter FLOAT,
  pb_mass FLOAT,
  pb_surface_temperature FLOAT,
  galaxy_name VARCHAR2(20),
  star_name VARCHAR2(20),
  PRIMARY KEY (pb_name)
);