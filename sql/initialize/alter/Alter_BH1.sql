ALTER TABLE Black_hole1 ADD FOREIGN KEY (bh_galaxy_name) REFERENCES Galaxy(galaxy_name);
--split
ALTER TABLE Black_hole1 ADD FOREIGN KEY (bh_mass) REFERENCES Black_hole2(bh_mass);