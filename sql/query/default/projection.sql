SELECT :set_columns
FROM Galaxy g
WHERE g.age > :age - 5 AND g.age < :age + 5