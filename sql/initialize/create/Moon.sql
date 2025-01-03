CREATE TABLE Moon (
  planetary_body_name VARCHAR2(20),
  moon_name VARCHAR2(10),
  m_surface_temperature FLOAT,
  mass FLOAT,
  diameter FLOAT,
  PRIMARY KEY (planetary_body_name,moon_name)
);