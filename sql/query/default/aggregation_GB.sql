select :set_group_by, :aggregation(n.N_LUMINOSITY)
from Nebula n
group by :set_group_by