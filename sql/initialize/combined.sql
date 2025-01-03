DROP TABLE Moon;

DROP TABLE Terrestrial_planet;

DROP TABLE Ice_giant;

DROP TABLE Gas_giant;

DROP TABLE Planetary_body;

DROP TABLE Star3;

DROP TABLE Star4;

DROP TABLE Star2;

DROP TABLE Star_cluster;

DROP TABLE Halo;

DROP TABLE Black_hole1;

DROP TABLE Black_hole2;

DROP TABLE Nebula;

DROP TABLE Galaxy;

CREATE TABLE Black_hole1 (
  bh_name VARCHAR2(30),
  angular_momentum FLOAT,
  electric_charge FLOAT,
  is_quasar CHAR(1),
  is_center CHAR(1),
  bh_mass FLOAT,
  bh_galaxy_name VARCHAR2(20),
  PRIMARY KEY (bh_name)
);

CREATE TABLE Black_hole2 (
  bh_mass FLOAT,
  event_horizon_radius FLOAT,
  PRIMARY KEY (bh_mass),
  UNIQUE (event_horizon_radius)
);

CREATE TABLE Galaxy (
  galaxy_name VARCHAR2(20),
  age FLOAT,
  hubble_classification VARCHAR2(4),
  PRIMARY KEY (galaxy_name)
);

CREATE TABLE Gas_giant (
  gas_name VARCHAR2(20),
  atmospheric_hydrogen_percentage FLOAT,
  atmospheric_helium_percentage FLOAT,
  PRIMARY KEY (gas_name)
);

CREATE TABLE Halo (
  halo_name VARCHAR2(20),
  h_luminosity FLOAT,
  h_galaxy_name VARCHAR2(20),
  PRIMARY KEY (halo_name)
);

CREATE TABLE Ice_giant (
  ice_name VARCHAR2(20),
  ice_H2O_percentage FLOAT,
  PRIMARY KEY (ice_name)
);

CREATE TABLE Moon (
  planetary_body_name VARCHAR2(20),
  moon_name VARCHAR2(10),
  m_surface_temperature FLOAT,
  mass FLOAT,
  diameter FLOAT,
  PRIMARY KEY (planetary_body_name,moon_name)
);

CREATE TABLE Nebula (
  nebula_name VARCHAR2(20),
  nebula_type VARCHAR2(20),
  n_luminosity FLOAT,
  n_galaxy_name VARCHAR2(20),
  PRIMARY KEY (nebula_name)
);

CREATE TABLE Planetary_body (
  pb_name VARCHAR2(20),
  pb_diameter FLOAT,
  pb_mass FLOAT,
  pb_surface_temperature FLOAT,
  galaxy_name VARCHAR2(20),
  star_name VARCHAR2(20),
  PRIMARY KEY (pb_name)
);

CREATE TABLE Star2 (
  s_surface_temperature FLOAT,
  stellar_classification VARCHAR2(5),
  PRIMARY KEY (s_surface_temperature)
);

CREATE TABLE Star3 (
  star_ID INTEGER,
  star_name VARCHAR2(20),
  star_lifetime FLOAT,
  s_age FLOAT,
  star_cluster_name VARCHAR2(20),
  s_galaxy_name VARCHAR2(20),
  s_diameter FLOAT,
  s_luminosity FLOAT,
  PRIMARY KEY (star_ID)
);

CREATE TABLE Star4 (
  s_diameter FLOAT,
  s_luminosity FLOAT,
  s_surface_temperature FLOAT,
  PRIMARY KEY (s_diameter, s_luminosity)
);

CREATE TABLE Star_cluster (
  sc_name VARCHAR2(20),
  sc_type VARCHAR2(10),
  PRIMARY KEY (sc_name)
);

CREATE TABLE Terrestrial_planet (
  tp_name VARCHAR2(20),
  habitability FLOAT,
  has_life CHAR(1),
  primary_solid_component VARCHAR2(20),
  PRIMARY KEY (tp_name)
);

INSERT INTO Black_hole1 (bh_name, angular_momentum, electric_charge, is_quasar, bh_galaxy_name, is_center, bh_mass) VALUES ('Sagittarius A*', 0.99, 0, 'N', 'Milky Way', 'Y', 4300000);

INSERT INTO Black_hole1 (bh_name, angular_momentum, electric_charge, is_quasar, bh_galaxy_name, is_center, bh_mass) VALUES ('M87*', 0.9, 0, 'Y', 'Messier 87', 'Y', 6500000000);

INSERT INTO Black_hole1 (bh_name, angular_momentum, electric_charge, is_quasar, bh_galaxy_name, is_center, bh_mass) VALUES ('TON 618', 0.8, 0, 'Y', 'TON 618 galaxy', 'Y', 66000000000);

INSERT INTO Black_hole1 (bh_name, angular_momentum, electric_charge, is_quasar, bh_galaxy_name, is_center, bh_mass) VALUES ('NGC 1277 Black Hole', 0.92, 0, 'N', 'NGC 1277', 'Y', 1700000000);

INSERT INTO Black_hole1 (bh_name, angular_momentum, electric_charge, is_quasar, bh_galaxy_name, is_center, bh_mass) VALUES ('Centaurus A Black Hole', 0.98, 0, 'N', 'Centaurus A', 'Y', 55000000);

INSERT INTO Black_hole2 (bh_mass, event_horizon_radius) VALUES (4300000, 12700000);

INSERT INTO Black_hole2 (bh_mass, event_horizon_radius) VALUES (6500000000, 19500000000);

INSERT INTO Black_hole2 (bh_mass, event_horizon_radius) VALUES (66000000000, 195000000000);

INSERT INTO Black_hole2 (bh_mass, event_horizon_radius) VALUES (1700000000, 5100000000);

INSERT INTO Black_hole2 (bh_mass, event_horizon_radius) VALUES (55000000, 165000000);

INSERT INTO Galaxy(galaxy_name, age, hubble_classification) VALUES ('Andromeda Galaxy', 9, 'SAsb');

INSERT INTO Galaxy(galaxy_name, age, hubble_classification) VALUES ('Milky Way', 13.6, 'SBbc');

INSERT INTO Galaxy(galaxy_name, age, hubble_classification) VALUES ('Triangulum Galaxy', 12, 'SAcd');

INSERT INTO Galaxy(galaxy_name, age, hubble_classification) VALUES ('Sombrero Galaxy', 13, 'SAsa');

INSERT INTO Galaxy(galaxy_name, age, hubble_classification) VALUES ('Whirlpool Galaxy', 10, 'SAbc');

INSERT INTO Galaxy(galaxy_name, age, hubble_classification) VALUES ('Messier 87', 13, 'E0');

INSERT INTO Galaxy(galaxy_name, age, hubble_classification) VALUES ('TON 618 galaxy', 12.2, 'QSO');

INSERT INTO Galaxy(galaxy_name, age, hubble_classification) VALUES ('NGC 1277', 14, 'E7');

INSERT INTO Galaxy(galaxy_name, age, hubble_classification) VALUES ('Centaurus A', 12, 'S0');

INSERT INTO Gas_giant (gas_name, atmospheric_hydrogen_percentage, atmospheric_helium_percentage) VALUES ('Jupiter', 90, 10);

INSERT INTO Gas_giant (gas_name, atmospheric_hydrogen_percentage, atmospheric_helium_percentage) VALUES ('Saturn', 96.3, 3.3);

INSERT INTO Gas_giant (gas_name, atmospheric_hydrogen_percentage, atmospheric_helium_percentage) VALUES ('Uranus', 83, 15);

INSERT INTO Gas_giant (gas_name, atmospheric_hydrogen_percentage, atmospheric_helium_percentage) VALUES ('Neptune', 80, 19);

INSERT INTO Gas_giant (gas_name, atmospheric_hydrogen_percentage, atmospheric_helium_percentage) VALUES ('HD 189733 b', 85, 14);

INSERT INTO Gas_giant (gas_name, atmospheric_hydrogen_percentage, atmospheric_helium_percentage) VALUES ('VMC 1061e', 63, 12);

INSERT INTO Halo(halo_name, h_luminosity, h_galaxy_name) VALUES ('Andromeda Halo', 1000000000000, 'Andromeda Galaxy');

INSERT INTO Halo(halo_name, h_luminosity, h_galaxy_name) VALUES ('Milky Way Halo', 1000000000, 'Milky Way');

INSERT INTO Halo(halo_name, h_luminosity, h_galaxy_name) VALUES ('Triangulum Halo', 10000000000, 'Triangulum Galaxy');

INSERT INTO Halo(halo_name, h_luminosity, h_galaxy_name) VALUES ('Sombrero Halo', 100000000000, 'Sombrero Galaxy');

INSERT INTO Halo(halo_name, h_luminosity, h_galaxy_name) VALUES ('Whirlpool Halo', 100000000, 'Whirlpool Galaxy');

INSERT INTO Ice_giant (ice_name, ice_H2O_percentage) VALUES ('Neptune', 30);

INSERT INTO Ice_giant (ice_name, ice_H2O_percentage) VALUES ('Uranus', 35);

INSERT INTO Ice_giant (ice_name, ice_H2O_percentage) VALUES ('Gliese 436 b', 25);

INSERT INTO Ice_giant (ice_name, ice_H2O_percentage) VALUES ('GJ 3470 b', 22);

INSERT INTO Ice_giant (ice_name, ice_H2O_percentage) VALUES ('VMC 1061e', 15);

INSERT INTO Moon (planetary_body_name, moon_name, m_surface_temperature, mass, diameter) VALUES ('Earth', 'Moon', -53, 7.35e+22, 3474);

INSERT INTO Moon (planetary_body_name, moon_name, m_surface_temperature, mass, diameter) VALUES ('Jupiter', 'Europa', -160, 4.8e+22, 3122);

INSERT INTO Moon (planetary_body_name, moon_name, m_surface_temperature, mass, diameter) VALUES ('Jupiter', 'Ganymede', -160, 1.48e+23, 5268);

INSERT INTO Moon (planetary_body_name, moon_name, m_surface_temperature, mass, diameter) VALUES ('Saturn', 'Titan', -179, 1.35e+23, 5151);

INSERT INTO Moon (planetary_body_name, moon_name, m_surface_temperature, mass, diameter) VALUES ('Mars', 'Phobos', -4, 10800000000000000, 22.4);

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Sombrero Nebula', 'Spiral', 8e+34, 'Milky Way');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('NGC 5195', 'Emission', 3.3e+33, 'Whirlpool Galaxy');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Eagle Nebula', 'Emission', 6.5e+34, 'Andromeda Galaxy');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Andromeda Nebula', 'Spiral', 1.2e+35, 'Andromeda Galaxy');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Orion Nebula', 'Emission', 9.6e+30, 'Milky Way');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Horsehead Nebula', 'Dark', 4.2e+30, 'Milky Way');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Helix Nebula', 'Planetary', 8.9e+30, 'Milky Way');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Carina Nebula', 'Emission', 1.3e+35, 'Milky Way');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Crab Nebula', 'Supernova Remnant', 4.8e+34, 'Milky Way');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Butterfly Nebula', 'Planetary', 3.7e+30, 'Milky Way');

INSERT INTO Nebula (nebula_name, nebula_type, n_luminosity, n_galaxy_name) VALUES ('Lagoon Nebula', 'Emission', 2.2e+34, 'Milky Way');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Earth', 15, 5.972e+24, 12742, 'Milky Way', 'Sol');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Mars', -63, 6.41e+23, 6779, 'Milky Way', 'Sol');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Jupiter', -108, 1.898e+27, 139820, 'Milky Way', 'Sol');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Saturn', -139, 5.683e+26, 116460, 'Milky Way', 'Sol');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Proxima Centauri b', 30, 1.17e+24, 12742, 'Milky Way', 'Proxima Centauri');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Proxima Centauri c', 40, 4.18e+25, 25000, 'Milky Way', 'Proxima Centauri');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Proxima Centauri d', 360, 1.56e+24, 8000, 'Milky Way', 'Proxima Centauri');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Uranus', 76, 8.681e+25, 50724, 'Milky Way', 'Sol');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Neptune', 72, 1.024e+26, 49244, 'Milky Way', 'Sol');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('HD 189733 b', 1200, 1.14e+27, 138500, 'Milky Way', null);

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Gliese 436 b', 712, 2.78e+26, 50200, 'Milky Way', null);

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('GJ 3470 b', 650, 1.97e+26, 37800, 'Milky Way', null);

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Venus', 737, 4.867e+24, 12104, 'Milky Way', 'Sol');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('Mercury', 440, 3.301e+23, 4879, 'Milky Way', 'Sol');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('VMC 1061b', 320, 1.2e+25, 22000, 'Milky Way', 'Vyssotsky McCormick');

INSERT INTO Planetary_body (pb_name, pb_surface_temperature, pb_mass, pb_diameter, galaxy_name, star_name) VALUES ('VMC 1061e', -120, 1.6e+26, 143000, 'Milky Way', 'Vyssotsky McCormick');

INSERT INTO Star2(s_surface_temperature, stellar_classification) VALUES (5500, 'G2V');

INSERT INTO Star2(s_surface_temperature, stellar_classification) VALUES (3042, 'M5.5');

INSERT INTO Star2(s_surface_temperature, stellar_classification) VALUES (1080, 'M6e');

INSERT INTO Star2(s_surface_temperature, stellar_classification) VALUES (3200, 'M3.5');

INSERT INTO Star2(s_surface_temperature, stellar_classification) VALUES (1277, 'M5.5e');

INSERT INTO Star2(s_surface_temperature, stellar_classification) VALUES (1440, 'M2e');

INSERT INTO Star2(s_surface_temperature, stellar_classification) VALUES (1405, 'M3');

INSERT INTO Star3(star_ID, star_name, star_lifetime, s_age, star_cluster_name, s_galaxy_name, s_diameter, s_luminosity) VALUES (1, 'Sol', 10, 4.6, null, 'Milky Way', 1, 1);

INSERT INTO Star3(star_ID, star_name, star_lifetime, s_age, star_cluster_name, s_galaxy_name, s_diameter, s_luminosity) VALUES (3, 'Proxima Centauri', 4000, 4.85, null, 'Milky Way', 0.142, 0.0017);

INSERT INTO Star3(star_ID, star_name, star_lifetime, s_age, star_cluster_name, s_galaxy_name, s_diameter, s_luminosity) VALUES (359, 'CN Leonis', 3.79, 0.356, 'Pleiades', 'Milky Way', 0.13, 0.0000207);

INSERT INTO Star3(star_ID, star_name, star_lifetime, s_age, star_cluster_name, s_galaxy_name, s_diameter, s_luminosity) VALUES (154, 'V1216 Sagittarii', 1, 0.8, 'Pleiades', 'Milky Way', 0.2, 0.000306);

INSERT INTO Star3(star_ID, star_name, star_lifetime, s_age, star_cluster_name, s_galaxy_name, s_diameter, s_luminosity) VALUES (248, 'Giclas', 2.9, 0.7, 'Pleiades', 'Milky Way', 0.17, 0.000106);

INSERT INTO Star3(star_ID, star_name, star_lifetime, s_age, star_cluster_name, s_galaxy_name, s_diameter, s_luminosity) VALUES (9352, 'Henry Draper', 0.397, 0.01, 'Pleiades', 'Milky Way', 0.491, 0.0108);

INSERT INTO Star3(star_ID, star_name, star_lifetime, s_age, star_cluster_name, s_galaxy_name, s_diameter, s_luminosity) VALUES (1061, 'Vyssotsky McCormick', 0.693, 0.4, 'Pleiades', 'Milky Way', 0.3, 0.00145);

INSERT INTO Star4(s_diameter, s_luminosity, s_surface_temperature) VALUES (1, 1, 5500);

INSERT INTO Star4(s_diameter, s_luminosity, s_surface_temperature) VALUES (0.142, 0.0017, 3042);

INSERT INTO Star4(s_diameter, s_luminosity, s_surface_temperature) VALUES (0.13, 0.0000207, 1080);

INSERT INTO Star4(s_diameter, s_luminosity, s_surface_temperature) VALUES (0.2, 0.000306, 3200);

INSERT INTO Star4(s_diameter, s_luminosity, s_surface_temperature) VALUES (0.17, 0.000106, 1277);

INSERT INTO Star4(s_diameter, s_luminosity, s_surface_temperature) VALUES (0.491, 0.0108, 1440);

INSERT INTO Star4(s_diameter, s_luminosity, s_surface_temperature) VALUES (0.3, 0.00145, 1405);

INSERT INTO Star_cluster (sc_name, sc_type) VALUES ('Pleiades', 'Open');

INSERT INTO Star_cluster (sc_name, sc_type) VALUES ('Hyades', 'Open');

INSERT INTO Star_cluster (sc_name, sc_type) VALUES ('Messier 13', 'Globular');

INSERT INTO Star_cluster (sc_name, sc_type) VALUES ('Omega Centauri', 'Globular');

INSERT INTO Star_cluster (sc_name, sc_type) VALUES ('Carina Nebula', 'Open');

INSERT INTO Terrestrial_planet (tp_name, habitability, has_life, primary_solid_component) VALUES ('Earth', 0.9, 'Y', 'Silicate Rock');

INSERT INTO Terrestrial_planet (tp_name, habitability, has_life, primary_solid_component) VALUES ('Mars', 0.3, 'N', 'Iron Oxide');

INSERT INTO Terrestrial_planet (tp_name, habitability, has_life, primary_solid_component) VALUES ('Venus', 0.1, 'N', 'Basalt');

INSERT INTO Terrestrial_planet (tp_name, habitability, has_life, primary_solid_component) VALUES ('Mercury', 0, 'N', 'Silicate Rock');

INSERT INTO Terrestrial_planet (tp_name, habitability, has_life, primary_solid_component) VALUES ('Proxima Centauri b', 0.6, 'N', 'Silicate Rock');

INSERT INTO Terrestrial_planet (tp_name, habitability, has_life, primary_solid_component) VALUES ('Proxima Centauri c', 0.1, 'N', 'Silicate Rock');

INSERT INTO Terrestrial_planet (tp_name, habitability, has_life, primary_solid_component) VALUES ('Proxima Centauri d', 0.05, 'N', 'Silicate Rock');

INSERT INTO Terrestrial_planet (tp_name, habitability, has_life, primary_solid_component) VALUES ('VMC 1061b', 0, 'N', 'Iron');

ALTER TABLE Black_hole1 ADD FOREIGN KEY (bh_galaxy_name) REFERENCES Galaxy(galaxy_name);

ALTER TABLE Black_hole1 ADD FOREIGN KEY (bh_mass) REFERENCES Black_hole2(bh_mass);

ALTER TABLE Gas_giant ADD FOREIGN KEY (gas_name) REFERENCES Planetary_body(pb_name) ON DELETE CASCADE;

ALTER TABLE Halo ADD FOREIGN KEY (h_galaxy_name) REFERENCES Galaxy(galaxy_name);

ALTER TABLE Ice_giant ADD FOREIGN KEY (ice_name) REFERENCES Planetary_body(pb_name) ON DELETE CASCADE;

ALTER TABLE Moon ADD FOREIGN KEY (planetary_body_name) REFERENCES Planetary_body(pb_name) ON DELETE CASCADE;

ALTER TABLE Nebula ADD FOREIGN KEY (n_galaxy_name) REFERENCES Galaxy(galaxy_name);

ALTER TABLE Planetary_body ADD FOREIGN KEY (galaxy_name) REFERENCES Galaxy(galaxy_name);

ALTER TABLE Star3 ADD FOREIGN KEY (s_galaxy_name) REFERENCES Galaxy(galaxy_name);

ALTER TABLE Star3 ADD FOREIGN KEY (star_cluster_name) REFERENCES Star_cluster(sc_name);

ALTER TABLE Star3 ADD FOREIGN KEY (s_diameter, s_luminosity) REFERENCES Star4(s_diameter, s_luminosity);

ALTER TABLE Star4 ADD FOREIGN KEY (s_surface_temperature) REFERENCES Star2(s_surface_temperature);

ALTER TABLE Terrestrial_planet ADD FOREIGN KEY (tp_name) REFERENCES Planetary_body(pb_name) ON DELETE CASCADE;