ALTER TABLE Star3 ADD FOREIGN KEY (s_galaxy_name) REFERENCES Galaxy(galaxy_name);
--split
ALTER TABLE Star3 ADD FOREIGN KEY (star_cluster_name) REFERENCES Star_cluster(sc_name);
--split
ALTER TABLE Star3 ADD FOREIGN KEY (s_diameter, s_luminosity) REFERENCES Star4(s_diameter, s_luminosity);