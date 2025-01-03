CREATE TABLE Terrestrial_planet (
  tp_name VARCHAR2(20),
  habitability FLOAT,
  has_life CHAR(1),
  primary_solid_component VARCHAR2(20),
  PRIMARY KEY (tp_name)
);