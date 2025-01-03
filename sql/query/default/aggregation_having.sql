select n.NEBULA_TYPE, :aggregation(n.N_LUMINOSITY)
from Nebula n
group by n.NEBULA_TYPE
having :set_conditions