select :gby, :aggregation(n.N_LUMINOSITY)
from Nebula n
group by :gby
having :aggregation(n.N_LUMINOSITY) :condition (select :aggregate_nested(n1.N_LUMINOSITY) from Nebula n1)