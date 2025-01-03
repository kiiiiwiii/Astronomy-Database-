SELECT h.halo_name, g.galaxy_name, g.age
FROM Halo h NATURAL JOIN Galaxy g
WHERE g.age > :gt AND h.h_galaxy_name = g.galaxy_name